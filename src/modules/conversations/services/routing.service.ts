import { Injectable } from '@nestjs/common';
import { Platform, Conversation } from '@prisma/client';

@Injectable()
export class RoutingService {
  /**
   * Determine the best platform to route the message.
   * Logic: Stay on IG/Messenger (FREE) if that's the source.
   * Use WhatsApp only if preferred or phone is known and source is WhatsApp.
   */
  async routeMessage(conversation: Conversation, customer: any): Promise<Platform> {
    if (conversation.platform === Platform.INSTAGRAM) {
      return Platform.INSTAGRAM; // Keep on IG (FREE)
    }

    if (conversation.platform === Platform.FACEBOOK) {
      return Platform.FACEBOOK; // Keep on Messenger (FREE)
    }

    if (conversation.platform === Platform.WHATSAPP) {
      return Platform.WHATSAPP;
    }

    // Default to the original platform
    return conversation.platform;
  }

  isFreePlatform(platform: Platform): boolean {
    return platform === Platform.INSTAGRAM || platform === Platform.FACEBOOK;
  }
}
