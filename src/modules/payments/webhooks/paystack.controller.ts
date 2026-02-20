import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { PaymentsService } from '../payments.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Webhooks')
@Controller('webhooks/paystack')
export class PaystackWebhookController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle Paystack webhooks' })
  async handle(
    @Body() body: any,
    @Headers('x-paystack-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(body, signature);
  }
}
