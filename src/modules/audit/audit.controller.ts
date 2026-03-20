import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Audit Logs')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard) // You can re-enable this if you want auth required
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit ledger logs for administration' })
  async findAll(@Query() query: any) {
    return this.auditService.findAll(query);
  }
}
