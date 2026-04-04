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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageClassifierService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const system_service_1 = require("../../system/system.service");
let MessageClassifierService = class MessageClassifierService {
    systemService;
    constructor(systemService) {
        this.systemService = systemService;
    }
    async validateFollowUp(conversation, eventType, now) {
        const lastUserMsg = conversation.lastUserMessageAt;
        const windowHours = await this.systemService.getSystemConfig('classification_service_window_hours', 24);
        const hasWindow = lastUserMsg ? (now.getTime() - lastUserMsg.getTime()) < windowHours * 3600 * 1000 : false;
        const utilityEvents = [
            client_1.EventType.ORDER_CREATED,
            client_1.EventType.ORDER_CONFIRMED,
            client_1.EventType.PAYMENT_RECEIVED,
            client_1.EventType.DELIVERY_UPDATE
        ];
        const isUtilityMessage = utilityEvents.includes(eventType) && (!!conversation.relatedOrderId || !!conversation.relatedCartId);
        return hasWindow || isUtilityMessage;
    }
    async classifyMessage(input) {
        const { conversation, eventType, senderIntent, content } = input;
        const now = input.now || new Date();
        const reasons = [];
        const canFollowUp = await this.validateFollowUp(conversation, eventType, now);
        if (!canFollowUp) {
            reasons.push("blocked: follow-up not allowed (outside window or no related order/cart)");
            return { category: client_1.MessageCategory.MARKETING, confidence: 1, reasons };
        }
        const windowHours = await this.systemService.getSystemConfig('classification_service_window_hours', 24);
        const hasWindow = conversation.lastUserMessageAt
            ? (now.getTime() - conversation.lastUserMessageAt.getTime()) < windowHours * 3600 * 1000
            : false;
        if (hasWindow) {
            reasons.push(`within ${windowHours}-hour user-initiated window`);
            return { category: client_1.MessageCategory.SERVICE, confidence: 1, reasons };
        }
        const utilityEvents = [
            client_1.EventType.ORDER_CREATED,
            client_1.EventType.ORDER_CONFIRMED,
            client_1.EventType.PAYMENT_RECEIVED,
            client_1.EventType.DELIVERY_UPDATE
        ];
        if (utilityEvents.includes(eventType)) {
            reasons.push(`eventType ${eventType} classified as utility`);
            return { category: client_1.MessageCategory.UTILITY, confidence: 0.95, reasons };
        }
        if (senderIntent === client_1.SenderIntent.PROMOTION) {
            reasons.push("senderIntent explicitly set to promotion");
            return { category: client_1.MessageCategory.MARKETING, confidence: 0.95, reasons };
        }
        const defaultKeywords = [
            "discount", "sale", "offer", "promo",
            "buy now", "limited", "deal", "free"
        ];
        const promoKeywords = await this.systemService.getSystemConfig('classification_promo_keywords', defaultKeywords);
        const textLower = content.text.toLowerCase();
        const containsPromo = promoKeywords.some((word) => textLower.includes(word.toLowerCase()));
        if (containsPromo) {
            reasons.push("contains promotional keyword");
            return { category: client_1.MessageCategory.MARKETING, confidence: 0.85, reasons };
        }
        if (eventType === client_1.EventType.MANUAL_MESSAGE) {
            reasons.push("manual_message defaulted to utility");
            return { category: client_1.MessageCategory.UTILITY, confidence: 0.75, reasons };
        }
        reasons.push("defaulted to utility");
        return { category: client_1.MessageCategory.UTILITY, confidence: 0.7, reasons };
    }
};
exports.MessageClassifierService = MessageClassifierService;
exports.MessageClassifierService = MessageClassifierService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [system_service_1.SystemService])
], MessageClassifierService);
//# sourceMappingURL=message-classifier.service.js.map