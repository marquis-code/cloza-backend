import { MessageCategory, SenderIntent, EventType } from '@prisma/client';
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
export declare class MessageClassifierService {
    validateFollowUp(conversation: ConversationContext, eventType: EventType, now: Date): boolean;
    classifyMessage(input: MessageInput): ClassificationResult;
}
