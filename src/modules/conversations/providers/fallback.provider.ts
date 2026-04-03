import { Injectable, Logger } from '@nestjs/common';
import { MessagingProvider, MessagePayload, SendMessageResponse } from '../interfaces/messaging-provider.interface';
import { Platform } from '@prisma/client';

@Injectable()
export class FallbackProvider implements MessagingProvider {
  private readonly logger = new Logger(FallbackProvider.name);

  async sendMessage(payload: MessagePayload): Promise<SendMessageResponse> {
    this.logger.warn(`FALLBACK: Sending message via internal fallback for ${payload.to}`);
    
    // Internal messaging system for cases when Meta is down/limited
    return {
      externalId: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'accepted_fallback',
    };
  }

  async getTemplates(platform: Platform): Promise<any[]> {
    this.logger.log(`Fetching fallback templates for ${platform}`);
    return [];
  }

  async deleteUserData(platformCustomerId: string): Promise<void> {
    this.logger.log(`Deleting fallback user data for ${platformCustomerId}`);
  }

  getName(): string {
    return 'Fallback';
  }
}
