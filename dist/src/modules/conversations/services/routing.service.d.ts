import { Platform, Conversation } from '@prisma/client';
export declare class RoutingService {
    routeMessage(conversation: Conversation, customer: any): Promise<Platform>;
    isFreePlatform(platform: Platform): boolean;
}
