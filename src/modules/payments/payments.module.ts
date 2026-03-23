import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaystackWebhookController } from './webhooks/paystack.controller';
import { ConversationsModule } from '../conversations/conversations.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [ConversationsModule, MailerModule],
  providers: [PaymentsService],
  controllers: [PaymentsController, PaystackWebhookController],
  exports: [PaymentsService],
})
export class PaymentsModule { }
