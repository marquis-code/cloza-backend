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
exports.CreatePostDto = exports.PostTargetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class PostTargetDto {
    platform;
    scheduledFor;
}
exports.PostTargetDto = PostTargetDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.Platform,
        example: 'INSTAGRAM',
        description: 'The platform to post to',
    }),
    (0, class_validator_1.IsEnum)(client_1.Platform),
    __metadata("design:type", String)
], PostTargetDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-03-01T12:00:00Z',
        description: 'The scheduled time for the post',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PostTargetDto.prototype, "scheduledFor", void 0);
class CreatePostDto {
    workspaceId;
    content;
    mediaUrls;
    targets;
}
exports.CreatePostDto = CreatePostDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'workspace-id-123',
        description: 'The ID of the workspace for the post',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "workspaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Hello, world! This is my first post using Cloza.',
        description: 'The text content of the post',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['https://example.com/media1.jpg'],
        description: 'List of media URLs for the post',
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePostDto.prototype, "mediaUrls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [PostTargetDto],
        description: 'Target platforms and schedules for the post',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PostTargetDto),
    __metadata("design:type", Array)
], CreatePostDto.prototype, "targets", void 0);
//# sourceMappingURL=create-post.dto.js.map