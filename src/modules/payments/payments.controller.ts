import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initialize/:orderId')
  @ApiOperation({ summary: 'Initialize a payment for an order' })
  @ApiResponse({ status: 201, description: 'Payment link generated' })
  async initialize(@Param('orderId') orderId: string) {
    return this.paymentsService.createPaymentLink(orderId);
  }
}
