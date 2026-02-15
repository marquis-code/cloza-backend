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
exports.SocialController = void 0;
const common_1 = require("@nestjs/common");
const social_service_1 = require("./social.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const create_post_dto_1 = require("./dto/create-post.dto");
const link_account_dto_1 = require("./dto/link-account.dto");
let SocialController = class SocialController {
    socialService;
    constructor(socialService) {
        this.socialService = socialService;
    }
    async createPost(createPostDto) {
        return this.socialService.createPost(createPostDto.workspaceId, createPostDto.content, createPostDto.mediaUrls || [], createPostDto.targets.map(t => ({
            platform: t.platform,
            scheduledFor: new Date(t.scheduledFor)
        })));
    }
    async getPosts(workspaceId) {
        return this.socialService.getPosts(workspaceId);
    }
    async linkAccount(linkAccountDto) {
        return this.socialService.linkAccount(linkAccountDto.workspaceId, linkAccountDto.data);
    }
    async getMetrics(workspaceId) {
        return this.socialService.getMetrics(workspaceId);
    }
};
exports.SocialController = SocialController;
__decorate([
    (0, common_1.Post)('posts'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule a new post' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Post scheduled successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)('posts/:workspaceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all posts for a workspace' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of posts' }),
    __param(0, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getPosts", null);
__decorate([
    (0, common_1.Post)('accounts'),
    (0, swagger_1.ApiOperation)({ summary: 'Link a social account' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Social account linked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [link_account_dto_1.LinkAccountDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "linkAccount", null);
__decorate([
    (0, common_1.Get)('metrics/:workspaceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get engagement metrics for a workspace' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Engagement metrics' }),
    __param(0, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getMetrics", null);
exports.SocialController = SocialController = __decorate([
    (0, swagger_1.ApiTags)('Social'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('social'),
    __metadata("design:paramtypes", [social_service_1.SocialService])
], SocialController);
//# sourceMappingURL=social.controller.js.map