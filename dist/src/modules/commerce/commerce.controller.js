"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommerceController = void 0;
const common_1 = require("@nestjs/common");
const commerce_service_1 = require("./commerce.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const create_product_dto_1 = require("./dto/create-product.dto");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
let CommerceController = class CommerceController {
    commerceService;
    constructor(commerceService) {
        this.commerceService = commerceService;
    }
    async createProduct(createProductDto) {
        const { workspaceId, ...data } = createProductDto;
        return this.commerceService.createProduct(workspaceId, data);
    }
    async getProducts(workspaceId) {
        return this.commerceService.getProducts(workspaceId);
    }
    async createOrder(createOrderDto) {
        return this.commerceService.createOrder(createOrderDto.workspaceId, createOrderDto.customerId, createOrderDto.itemIds);
    }
    async getOrders(workspaceId) {
        return this.commerceService.getOrders(workspaceId);
    }
    async updateStatus(id, updateOrderStatusDto) {
        return this.commerceService.updateOrderStatus(id, updateOrderStatusDto.status);
    }
};
exports.CommerceController = CommerceController;
__decorate([
    (0, common_1.Post)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], CommerceController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('products/:workspaceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products for a workspace' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of products' }),
    __param(0, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommerceController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], CommerceController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders/:workspaceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders for a workspace' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of orders' }),
    __param(0, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommerceController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order status updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], CommerceController.prototype, "updateStatus", null);
exports.CommerceController = CommerceController = __decorate([
    (0, swagger_1.ApiTags)('Commerce'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('commerce'),
    __metadata("design:paramtypes", [commerce_service_1.CommerceService])
], CommerceController);
//# sourceMappingURL=commerce.controller.js.map