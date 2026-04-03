import { MessageFormat, MessageCategory, Platform } from '@prisma/client';
export interface MessagePayload {
    to: string;
    content: string;
    format: MessageFormat;
    category: MessageCategory;
    platform: Platform;
    externalTemplateId?: string;
}
export interface SendMessageResponse {
    externalId: string;
    status: string;
}
export interface MessagingProvider {
    sendMessage(payload: MessagePayload): Promise<SendMessageResponse>;
    getTemplates(platform: Platform): Promise<any[]>;
    deleteUserData(platformCustomerId: string): Promise<void>;
    getName(): string;
}
