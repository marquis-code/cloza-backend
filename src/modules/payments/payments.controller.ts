import { Controller, Post, Param, UseGuards, Body, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { CreatePayoutAccountDto } from './dto/payout-account.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) { }

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize a payment for an order' })
  @ApiResponse({ status: 201, description: 'Payment link generated' })
  async initialize(@Body() dto: InitializePaymentDto) {
    return this.paymentsService.createPaymentLink(dto.orderId, dto.conversationId);
  }

  @Post('payout-accounts')
  @ApiOperation({ summary: 'Add a payout account' })
  async addPayoutAccount(@Body() dto: CreatePayoutAccountDto) {
    return this.paymentsService.addPayoutAccount(dto.workspaceId, {
      bankName: dto.bankName,
      accountNumber: dto.accountNumber,
    });
  }

  @Get('payout-accounts/:workspaceId')
  @ApiOperation({ summary: 'Get payout accounts for a workspace' })
  async getPayoutAccounts(@Param('workspaceId') workspaceId: string) {
    return this.paymentsService.getPayoutAccounts(workspaceId);
  }
}
