import { MessagingProvider, MessagePayload, SendMessageResponse } from '../interfaces/messaging-provider.interface';
import { Platform } from '@prisma/client';
export declare class MetaProvider implements MessagingProvider {
    private readonly logger;
    sendMessage(payload: MessagePayload): Promise<SendMessageResponse>;
    getTemplates(platform: Platform): Promise<any[]>;
    deleteUserData(platformCustomerId: string): Promise<void>;
    getName(): string;
}
