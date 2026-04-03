"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FallbackProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FallbackProvider = void 0;
const common_1 = require("@nestjs/common");
let FallbackProvider = FallbackProvider_1 = class FallbackProvider {
    logger = new common_1.Logger(FallbackProvider_1.name);
    async sendMessage(payload) {
        this.logger.warn(`FALLBACK: Sending message via internal fallback for ${payload.to}`);
        return {
            externalId: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: 'accepted_fallback',
        };
    }
    async getTemplates(platform) {
        this.logger.log(`Fetching fallback templates for ${platform}`);
        return [];
    }
    async deleteUserData(platformCustomerId) {
        this.logger.log(`Deleting fallback user data for ${platformCustomerId}`);
    }
    getName() {
        return 'Fallback';
    }
};
exports.FallbackProvider = FallbackProvider;
exports.FallbackProvider = FallbackProvider = FallbackProvider_1 = __decorate([
    (0, common_1.Injectable)()
], FallbackProvider);
//# sourceMappingURL=fallback.provider.js.map