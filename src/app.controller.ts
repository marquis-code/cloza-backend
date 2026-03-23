import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PLANS } from './common/constants/plans';

@ApiTags('Public')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get all available pricing plans' })
  @ApiResponse({ status: 200, description: 'Returns all pricing plans' })
  getPlans() {
    return { plans: PLANS };
  }
}
