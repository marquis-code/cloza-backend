import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ConversationsService } from '../conversations.service';
import { SenderType, MessageFormat, EventType, SenderIntent } from '@prisma/client';

@Processor('message-followup')
export class FollowUpProcessor extends WorkerHost {
  private readonly logger = new Logger(FollowUpProcessor.name);

  constructor(
    private prisma: PrismaService,
    private conversationsService: ConversationsService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { conversationId, type } = job.data;
    this.logger.log(`Processing follow-up ${type} for conversation ${conversationId}`);

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
        }
      }
    });

    if (!conversation) return;

    // 1. Check 24h window
    const now = new Date();
    const lastUserMsg = conversation.lastUserMessageAt;
    const isWithin24h = lastUserMsg ? (now.getTime() - lastUserMsg.getTime()) < 24 * 3600 * 1000 : false;

    if (!isWithin24h) {
      this.logger.log(`Follow-up ${type} skipped: Outside 24h window for ${conversationId}`);
      return;
    }

    // 2. Check if customer has already replied (last message should be from customer if we want to nudge them? 
    // Actually, user said: "Follow-ups within 24 hours of a users customers message not users reply")
    // Wait, if the customer messaged, and I (the merchant) haven't replied? No, usually follow-ups are nudges for the customer.
    // user examples: "1 hour later -> reminder, 6 hours -> nudge, 23 hours -> final reminder"
    // This implies the MERCHANT is following up on a customer's query or abandoned action.
    
    const lastMessage = conversation.messages[0];
    if (lastMessage && lastMessage.senderType === SenderType.USER) {
        this.logger.log(`Follow-up ${type} skipped: Merchant already replied to ${conversationId}`);
        return;
    }

    // 3. Send Follow-up
    const content = this.getFollowUpContent(type);
    
    await this.conversationsService.sendMessage('SYSTEM', SenderType.USER, {
        conversationId,
        content,
        format: MessageFormat.TEXT,
        eventType: EventType.MANUAL_MESSAGE,
        senderIntent: SenderIntent.REMINDER,
    });

    this.logger.log(`Follow-up ${type} sent successfully to ${conversationId}`);
  }

  private getFollowUpContent(type: string): string {
    switch (type) {
      case '1h': return "Hi there! Just checking if you have any questions about the products you were looking at? 😊";
      case '6h': return "Quick nudge! We're still here to help if you'd like to complete your order.";
      case '23h': return "Final reminder: Your cart is waiting! Our 24-hour window is closing soon. Let us know if you're ready! 🚀";
      default: return "Just checking back in!";
    }
  }
}
