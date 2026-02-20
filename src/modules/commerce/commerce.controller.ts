import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
  Patch,
} from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Commerce')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('commerce')
export class CommerceController {
  constructor(private commerceService: CommerceService) {}

  // Products
  @Post('products')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const { workspaceId, ...data } = createProductDto;
    return this.commerceService.createProduct(workspaceId, data);
  }

  @Get('products/:workspaceId')
  @ApiOperation({ summary: 'Get all products for a workspace' })
  @ApiResponse({ status: 200, description: 'List of products' })
  async getProducts(@Param('workspaceId') workspaceId: string) {
    return this.commerceService.getProducts(workspaceId);
  }

  // Orders
  @Post('orders')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.commerceService.createOrder(
      createOrderDto.workspaceId,
      createOrderDto.customerId,
      createOrderDto.itemIds,
      createOrderDto.sourcePostId,
    );
  }

  @Get('orders/:workspaceId')
  @ApiOperation({ summary: 'Get all orders for a workspace' })
  @ApiResponse({ status: 200, description: 'List of orders' })
  async getOrders(@Param('workspaceId') workspaceId: string) {
    return this.commerceService.getOrders(workspaceId);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.commerceService.updateOrderStatus(
      id,
      updateOrderStatusDto.status,
    );
  }
}
