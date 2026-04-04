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
var BillingEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
const system_service_1 = require("../../system/system.service");
let BillingEngineService = BillingEngineService_1 = class BillingEngineService {
    prisma;
    systemService;
    logger = new common_1.Logger(BillingEngineService_1.name);
    pricing = {
        [client_1.MessageCategory.SERVICE]: 0.00,
        [client_1.MessageCategory.UTILITY]: 0.05,
        [client_1.MessageCategory.MARKETING]: 0.10,
    };
    constructor(prisma, systemService) {
        this.prisma = prisma;
        this.systemService = systemService;
    }
    async calculateMessageCost(workspaceId, customerId, category, orderId) {
        const config = await this.prisma.pricingConfig.findUnique({
            where: { category }
        });
        let cost = config ? Number(config.price) : this.pricing[category];
        if (category === client_1.MessageCategory.UTILITY && orderId) {
            const utilityCount = await this.prisma.message.count({
                where: {
                    category: client_1.MessageCategory.UTILITY,
                    conversation: {
                        workspaceId,
                        customerId,
                        relatedOrderId: orderId,
                    },
                },
            });
            const limit = await this.systemService.getSystemConfig('billing_utility_limit', 3);
            if (utilityCount >= limit) {
                const surcharge = await this.systemService.getSystemConfig('billing_utility_surcharge', 0.02);
                this.logger.log(`Utility limit exceeded for order ${orderId} (${utilityCount}/${limit}). Charging extra.`);
                cost += surcharge;
            }
        }
        return cost;
    }
    async trackCustomerMessageRatio(workspaceId, customerId) {
        const totalMessages = await this.prisma.message.count({
            where: {
                conversation: { workspaceId, customerId }
            }
        });
        const categoriesCount = await this.prisma.message.groupBy({
            by: ['category'],
            where: {
                conversation: { workspaceId, customerId }
            },
            _count: true
        });
        return {
            total: totalMessages,
            distribution: categoriesCount.reduce((acc, curr) => {
                acc[curr.category] = curr._count;
                return acc;
            }, {})
        };
    }
};
exports.BillingEngineService = BillingEngineService;
exports.BillingEngineService = BillingEngineService = BillingEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        system_service_1.SystemService])
], BillingEngineService);
//# sourceMappingURL=billing-engine.service.js.map