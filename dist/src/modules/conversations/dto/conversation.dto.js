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
exports.StartConversationDto = exports.CreateMessageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateMessageDto {
    conversationId;
    content;
    type;
    payload;
}
exports.CreateMessageDto = CreateMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'conversation-id-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello, is this still available?' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.MessageType, default: client_1.MessageType.TEXT }),
    (0, class_validator_1.IsEnum)(client_1.MessageType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { productId: '123' }, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateMessageDto.prototype, "payload", void 0);
class StartConversationDto {
    workspaceId;
    customerId;
    platform;
}
exports.StartConversationDto = StartConversationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'workspace-id-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartConversationDto.prototype, "workspaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'customer-id-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartConversationDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'WHATSAPP' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], StartConversationDto.prototype, "platform", void 0);
//# sourceMappingURL=conversation.dto.js.map