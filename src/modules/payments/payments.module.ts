import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaystackWebhookController } from './webhooks/paystack.controller';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController, PaystackWebhookController],
  exports: [PaymentsService],
})
export class PaymentsModule { }
