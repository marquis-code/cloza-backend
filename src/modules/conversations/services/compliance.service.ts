import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(private prisma: PrismaService) {}

  async trackOptIn(conversationId: string, status: boolean) {
    this.logger.log(`Opt-in update for conversation ${conversationId}: ${status}`);
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { optInStatus: status },
    });
  }

  async monitorQualityRating(workspaceId: string, rating: string) {
    this.logger.warn(`Quality rating update for workspace ${workspaceId}: ${rating}`);
    // This could trigger an alert or a fallback to Messenger/IG if WhatsApp quality is low
    return this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        // Assume there's a quality rating field or log in workspace
        // For now, let's log the rating elsewhere or update a conversation meta-field
      },
    });
  }

  async deleteUserData(platformCustomerId: string) {
    this.logger.log(`Performing Meta-required data deletion for platform customer ${platformCustomerId}`);
    // Logic to nullify/delete records for this customer to comply with GDPR/Meta
    const customer = await this.prisma.customer.findFirst({
        where: { platformCustomerId }
    });
    if (customer) {
        await this.prisma.message.deleteMany({
            where: { conversation: { customerId: customer.id } }
        });
        await this.prisma.customer.update({
            where: { id: customer.id },
            data: { 
                name: "DELETED",
                email: "DELETED@DELETED.COM",
                phone: "DELETED",
            }
        });
    }
  }
}
