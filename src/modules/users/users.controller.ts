import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

import { MailerService } from '../mailer/mailer.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private mailerService: MailerService,
    ) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
    async getProfile(@Request() req) {
        return this.usersService.findById(req.user.id);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, description: 'User profile updated successfully' })
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(req.user.id, updateUserDto);
    }

    @Patch('onboard')
    @ApiOperation({ summary: 'Mark user as onboarded' })
    @ApiResponse({ status: 200, description: 'User marked as onboarded successfully' })
    async markAsOnboarded(@Request() req) {
        const user = await this.usersService.update(req.user.id, { isOnboarded: true });
        await this.mailerService.sendWelcomeEmail(user.email, user.name || 'there');
        return user;
    }
}
