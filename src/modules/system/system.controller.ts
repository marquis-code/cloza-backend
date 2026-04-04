import { Controller, Get, Post, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { SystemService } from './system.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, MessageCategory } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('System')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('pricing')
  @ApiOperation({ summary: 'Get all message pricing configurations' })
  async getPricing() {
    return this.systemService.getPricing();
  }

  @Patch('pricing/:category')
  @ApiOperation({ summary: 'Update pricing for a message category' })
  async updatePricing(
    @Param('category') category: MessageCategory,
    @Body('price') price: number,
  ) {
    return this.systemService.updatePricing(category, price);
  }

  @Get('configs')
  @ApiOperation({ summary: 'Get all system configurations' })
  async getConfigs() {
    return this.systemService.getSystemConfigs();
  }

  @Post('configs/upsert')
  @ApiOperation({ summary: 'Create or update a system configuration' })
  async upsertConfig(
    @Body('key') key: string,
    @Body('value') value: string,
    @Body('type') type?: string,
  ) {
    return this.systemService.updateSystemConfig(key, value, type);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get list of all users' })
  async getUsers(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.systemService.getUsers(skip ? Number(skip) : 0, take ? Number(take) : 50);
  }

  @Get('workspaces')
  @ApiOperation({ summary: 'Get list of all workspaces' })
  async getWorkspaces(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.systemService.getWorkspaces(skip ? Number(skip) : 0, take ? Number(take) : 50);
  }
}
