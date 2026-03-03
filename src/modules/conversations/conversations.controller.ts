import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
    Param,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { CreateMessageDto, StartConversationDto } from './dto/conversation.dto';
import { SenderType } from '@prisma/client';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
    constructor(private conversationsService: ConversationsService) { }

    @Post()
    @ApiOperation({ summary: 'Start or get a conversation' })
    async startConversation(@Body() dto: StartConversationDto) {
        return this.conversationsService.startConversation(
            dto.workspaceId,
            dto.customerId,
            dto.platform,
        );
    }

    @Post('messages')
    @ApiOperation({ summary: 'Send a message' })
    async sendMessage(@Request() req, @Body() dto: CreateMessageDto) {
        // Assuming the user is sending the message from the app
        return this.conversationsService.sendMessage(req.user.id, SenderType.USER, dto);
    }

    @Get('workspace/:workspaceId')
    @ApiOperation({ summary: 'Get all conversations for a workspace' })
    async getConversations(@Param('workspaceId') workspaceId: string) {
        return this.conversationsService.getConversations(workspaceId);
    }

    @Get(':id/messages')
    @ApiOperation({ summary: 'Get messages for a conversation' })
    async getMessages(@Param('id') id: string) {
        return this.conversationsService.getMessages(id);
    }
}
