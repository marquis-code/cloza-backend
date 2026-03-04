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
exports.UpdateWorkspaceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateWorkspaceDto {
    name;
    businessCategory;
    businessLocation;
    defaultCurrency;
    paymentConfirmationMessage;
    followUpReminders;
    newBuyerAlerts;
}
exports.UpdateWorkspaceDto = UpdateWorkspaceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Daniel\'s Fashion Store', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkspaceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fashion & Apparel', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkspaceDto.prototype, "businessCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lagos, Nigeria', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkspaceDto.prototype, "businessLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NGN', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkspaceDto.prototype, "defaultCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Thank you for your payment. Your order will be processed shortly.', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkspaceDto.prototype, "paymentConfirmationMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateWorkspaceDto.prototype, "followUpReminders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateWorkspaceDto.prototype, "newBuyerAlerts", void 0);
//# sourceMappingURL=update-workspace.dto.js.map