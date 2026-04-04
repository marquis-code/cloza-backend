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
exports.SystemController = void 0;
const common_1 = require("@nestjs/common");
const system_service_1 = require("./system.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let SystemController = class SystemController {
    systemService;
    constructor(systemService) {
        this.systemService = systemService;
    }
    async getPricing() {
        return this.systemService.getPricing();
    }
    async updatePricing(category, price) {
        return this.systemService.updatePricing(category, price);
    }
    async getConfigs() {
        return this.systemService.getSystemConfigs();
    }
    async upsertConfig(key, value, type) {
        return this.systemService.updateSystemConfig(key, value, type);
    }
    async getUsers(skip, take) {
        return this.systemService.getUsers(skip ? Number(skip) : 0, take ? Number(take) : 50);
    }
    async getWorkspaces(skip, take) {
        return this.systemService.getWorkspaces(skip ? Number(skip) : 0, take ? Number(take) : 50);
    }
};
exports.SystemController = SystemController;
__decorate([
    (0, common_1.Get)('pricing'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all message pricing configurations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "getPricing", null);
__decorate([
    (0, common_1.Patch)('pricing/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Update pricing for a message category' }),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Body)('price')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "updatePricing", null);
__decorate([
    (0, common_1.Get)('configs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all system configurations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "getConfigs", null);
__decorate([
    (0, common_1.Post)('configs/upsert'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update a system configuration' }),
    __param(0, (0, common_1.Body)('key')),
    __param(1, (0, common_1.Body)('value')),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "upsertConfig", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of all users' }),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('workspaces'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of all workspaces' }),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "getWorkspaces", null);
exports.SystemController = SystemController = __decorate([
    (0, swagger_1.ApiTags)('System'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('system'),
    __metadata("design:paramtypes", [system_service_1.SystemService])
], SystemController);
//# sourceMappingURL=system.controller.js.map