import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':workspaceId/:customerId')
  @ApiOperation({ summary: 'Create a new cart for a customer' })
  async create(
    @Param('workspaceId') workspaceId: string,
    @Param('customerId') customerId: string,
    @Body() data: any,
  ) {
    return this.cartService.create(workspaceId, customerId, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by ID' })
  async findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cart' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.cartService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart' })
  async remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  @Get('customer/:workspaceId/:customerId')
  @ApiOperation({ summary: 'Get all carts for a customer' })
  async findByCustomer(
    @Param('workspaceId') workspaceId: string,
    @Param('customerId') customerId: string,
  ) {
    return this.cartService.findByCustomer(workspaceId, customerId);
  }
}
