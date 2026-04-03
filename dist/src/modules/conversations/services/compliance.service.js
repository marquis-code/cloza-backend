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
var ComplianceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma/prisma.service");
let ComplianceService = ComplianceService_1 = class ComplianceService {
    prisma;
    logger = new common_1.Logger(ComplianceService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackOptIn(conversationId, status) {
        this.logger.log(`Opt-in update for conversation ${conversationId}: ${status}`);
        return this.prisma.conversation.update({
            where: { id: conversationId },
            data: { optInStatus: status },
        });
    }
    async monitorQualityRating(workspaceId, rating) {
        this.logger.warn(`Quality rating update for workspace ${workspaceId}: ${rating}`);
        return this.prisma.workspace.update({
            where: { id: workspaceId },
            data: {},
        });
    }
    async deleteUserData(platformCustomerId) {
        this.logger.log(`Performing Meta-required data deletion for platform customer ${platformCustomerId}`);
        const customer = await this.prisma.customer.findFirst({
            where: { platformCustomerId }
        });
        if (customer) {
            await this.prisma.message.deleteMany({
                where: { conversation: { customerId: customer.id } }
            });
            await this.prisma.customer.update({
                where: { id: customer.id },
                data: {
                    name: "DELETED",
                    email: "DELETED@DELETED.COM",
                    phone: "DELETED",
                }
            });
        }
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = ComplianceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map