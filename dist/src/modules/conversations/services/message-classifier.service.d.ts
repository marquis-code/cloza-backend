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
import { SystemService } from '../../system/system.service';
export declare class MessageClassifierService {
    private systemService;
    constructor(systemService: SystemService);
    validateFollowUp(conversation: ConversationContext, eventType: EventType, now: Date): Promise<boolean>;
    classifyMessage(input: MessageInput): Promise<ClassificationResult>;
}
