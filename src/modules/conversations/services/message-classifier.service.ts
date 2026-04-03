import { Injectable } from '@nestjs/common';
import { MessageFormat, MessageCategory, SenderIntent, EventType } from '@prisma/client';

export interface ConversationContext {
  lastUserMessageAt: Date | null;
  relatedOrderId?: string | null;
  relatedCartId?: string | null;
}

export interface MessageContent {
  text: string;
  containsLink?: boolean;
}

export interface MessageInput {
  conversation: ConversationContext;
  eventType: EventType;
  senderIntent: SenderIntent;
  content: MessageContent;
  now?: Date;
}

export interface ClassificationResult {
  category: MessageCategory;
  confidence: number;
  reasons: string[];
}

@Injectable()
export class MessageClassifierService {
  /**
   * Determine if a follow-up is allowed based on context
   */
  validateFollowUp(conversation: ConversationContext, eventType: EventType, now: Date): boolean {
    const lastUserMsg = conversation.lastUserMessageAt;
    const has24hWindow = lastUserMsg ? (now.getTime() - lastUserMsg.getTime()) < 24 * 3600 * 1000 : false;

    const utilityEvents: EventType[] = [
      EventType.ORDER_CREATED,
      EventType.ORDER_CONFIRMED,
      EventType.PAYMENT_RECEIVED,
      EventType.DELIVERY_UPDATE
    ];

    // Allowed if within 24h or is a utility message tied to order/cart
    const isUtilityMessage = utilityEvents.includes(eventType) && (!!conversation.relatedOrderId || !!conversation.relatedCartId);
    return has24hWindow || isUtilityMessage;
  }

  /**
   * Core classifier function
   */
  classifyMessage(input: MessageInput): ClassificationResult {
    const { conversation, eventType, senderIntent, content } = input;
    const now = input.now || new Date();
    const reasons: string[] = [];

    // 1️⃣ Enforce context-based follow-up
    const canFollowUp = this.validateFollowUp(conversation, eventType, now);
    if (!canFollowUp) {
      reasons.push("blocked: follow-up not allowed (outside 24h or no related order/cart)");
      return { category: MessageCategory.MARKETING, confidence: 1, reasons }; // treat as blocked marketing
    }

    // 2️⃣ Within 24h → service
    const has24hWindow = conversation.lastUserMessageAt
      ? (now.getTime() - conversation.lastUserMessageAt.getTime()) < 24 * 3600 * 1000
      : false;

    if (has24hWindow) {
      reasons.push("within 24-hour user-initiated window");
      return { category: MessageCategory.SERVICE, confidence: 1, reasons };
    }

    // 3️⃣ Event-based utility classification
    const utilityEvents: EventType[] = [
      EventType.ORDER_CREATED,
      EventType.ORDER_CONFIRMED,
      EventType.PAYMENT_RECEIVED,
      EventType.DELIVERY_UPDATE
    ];
    if (utilityEvents.includes(eventType)) {
      reasons.push(`eventType ${eventType} classified as utility`);
      return { category: MessageCategory.UTILITY, confidence: 0.95, reasons };
    }

    // 4️⃣ Sender intent override
    if (senderIntent === SenderIntent.PROMOTION) {
      reasons.push("senderIntent explicitly set to promotion");
      return { category: MessageCategory.MARKETING, confidence: 0.95, reasons };
    }

    // 5️⃣ Content heuristic detection
    const promoKeywords = [
      "discount", "sale", "offer", "promo",
      "buy now", "limited", "deal", "free"
    ];
    const textLower = content.text.toLowerCase();
    const containsPromo = promoKeywords.some(word => textLower.includes(word));
    if (containsPromo) {
      reasons.push("contains promotional keyword");
      return { category: MessageCategory.MARKETING, confidence: 0.85, reasons };
    }

    // 6️⃣ Safe fallback for manual messages
    if (eventType === EventType.MANUAL_MESSAGE) {
      reasons.push("manual_message defaulted to utility");
      return { category: MessageCategory.UTILITY, confidence: 0.75, reasons };
    }

    // 7️⃣ Default
    reasons.push("defaulted to utility");
    return { category: MessageCategory.UTILITY, confidence: 0.7, reasons };
  }
}
