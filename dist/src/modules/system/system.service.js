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
var SystemService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let SystemService = SystemService_1 = class SystemService {
    prisma;
    logger = new common_1.Logger(SystemService_1.name);
    configCache = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPricing() {
        return this.prisma.pricingConfig.findMany({
            orderBy: { category: 'asc' },
        });
    }
    async updatePricing(category, price) {
        this.logger.log(`Updating pricing for ${category} to ${price}`);
        return this.prisma.pricingConfig.upsert({
            where: { category },
            update: { price },
            create: { category, price },
        });
    }
    async getSystemConfigs() {
        return this.prisma.systemConfig.findMany({
            orderBy: { key: 'asc' },
        });
    }
    async updateSystemConfig(key, value, type = 'string') {
        this.logger.log(`Updating system config ${key} to ${value} (type: ${type})`);
        const result = await this.prisma.systemConfig.upsert({
            where: { key },
            update: { value, type },
            create: { key, value, type },
        });
        this.configCache.delete(key);
        return result;
    }
    async getSystemConfig(key, defaultValue) {
        if (this.configCache.has(key)) {
            return this.configCache.get(key);
        }
        const config = await this.prisma.systemConfig.findUnique({
            where: { key },
        });
        if (!config)
            return defaultValue;
        let value = config.value;
        if (config.type === 'number')
            value = Number(config.value);
        if (config.type === 'json') {
            try {
                value = JSON.parse(config.value);
            }
            catch (e) {
                value = defaultValue;
            }
        }
        if (config.type === 'boolean')
            value = config.value === 'true';
        this.configCache.set(key, value);
        return value;
    }
    async getUsers(skip = 0, take = 50) {
        return this.prisma.user.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                isOnboarded: true,
                emailVerified: true,
            }
        });
    }
    async getWorkspaces(skip = 0, take = 50) {
        return this.prisma.workspace.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { members: true, conversations: true, orders: true }
                }
            }
        });
    }
};
exports.SystemService = SystemService;
exports.SystemService = SystemService = SystemService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemService);
//# sourceMappingURL=system.service.js.map