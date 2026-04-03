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
let BillingEngineService = BillingEngineService_1 = class BillingEngineService {
    prisma;
    logger = new common_1.Logger(BillingEngineService_1.name);
    pricing = {
        [client_1.MessageCategory.SERVICE]: 0.00,
        [client_1.MessageCategory.UTILITY]: 0.05,
        [client_1.MessageCategory.MARKETING]: 0.10,
    };
    UTILITY_LIMIT_PER_ORDER = 3;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateMessageCost(workspaceId, customerId, category, orderId) {
        let cost = this.pricing[category];
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
            if (utilityCount >= this.UTILITY_LIMIT_PER_ORDER) {
                this.logger.log(`Utility limit exceeded for order ${orderId} (${utilityCount}/${this.UTILITY_LIMIT_PER_ORDER}). Charging extra.`);
                cost += 0.02;
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BillingEngineService);
//# sourceMappingURL=billing-engine.service.js.map