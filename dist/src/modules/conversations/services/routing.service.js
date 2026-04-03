"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let RoutingService = class RoutingService {
    async routeMessage(conversation, customer) {
        if (conversation.platform === client_1.Platform.INSTAGRAM) {
            return client_1.Platform.INSTAGRAM;
        }
        if (conversation.platform === client_1.Platform.FACEBOOK) {
            return client_1.Platform.FACEBOOK;
        }
        if (conversation.platform === client_1.Platform.WHATSAPP) {
            return client_1.Platform.WHATSAPP;
        }
        return conversation.platform;
    }
    isFreePlatform(platform) {
        return platform === client_1.Platform.INSTAGRAM || platform === client_1.Platform.FACEBOOK;
    }
};
exports.RoutingService = RoutingService;
exports.RoutingService = RoutingService = __decorate([
    (0, common_1.Injectable)()
], RoutingService);
//# sourceMappingURL=routing.service.js.map