import { Controller, Post, Body, Get, UseGuards, Request, Param } from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { LinkAccountDto } from './dto/link-account.dto';

@ApiTags('Social')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('social')
export class SocialController {
    constructor(private socialService: SocialService) { }

    @Post('posts')
    @ApiOperation({ summary: 'Schedule a new post' })
    @ApiResponse({ status: 201, description: 'Post scheduled successfully' })
    async createPost(@Body() createPostDto: CreatePostDto) {
        return this.socialService.createPost(
            createPostDto.workspaceId,
            createPostDto.content,
            createPostDto.mediaUrls || [],
            createPostDto.targets.map(t => ({
                platform: t.platform,
                scheduledFor: new Date(t.scheduledFor)
            }))
        );
    }

    @Get('posts/:workspaceId')
    @ApiOperation({ summary: 'Get all posts for a workspace' })
    @ApiResponse({ status: 200, description: 'List of posts' })
    async getPosts(@Param('workspaceId') workspaceId: string) {
        return this.socialService.getPosts(workspaceId);
    }

    @Post('accounts')
    @ApiOperation({ summary: 'Link a social account' })
    @ApiResponse({ status: 201, description: 'Social account linked successfully' })
    async linkAccount(@Body() linkAccountDto: LinkAccountDto) {
        return this.socialService.linkAccount(linkAccountDto.workspaceId, linkAccountDto.data);
    }

    @Get('metrics/:workspaceId')
    @ApiOperation({ summary: 'Get engagement metrics for a workspace' })
    @ApiResponse({ status: 200, description: 'Engagement metrics' })
    async getMetrics(@Param('workspaceId') workspaceId: string) {
        return this.socialService.getMetrics(workspaceId);
    }
}
