import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 400,
    description: 'User already exists or validation error',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Token generated' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or email not verified' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('google')
  @ApiOperation({ summary: 'Login with Google' })
  @ApiResponse({ status: 200, description: 'Token generated' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async googleLogin(@Body('idToken') idToken: string) {
    return this.authService.googleLogin(idToken);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify user email (Signup)' })
  async verifyEmail(@Body() body: { email: string; code: string }) {
    return this.authService.verifyEmail(body.email, body.code);
  }

  @Post('verify-login')
  @ApiOperation({ summary: 'Verify login code (2FA)' })
  async verifyLogin(@Body() body: { email: string; code: string }) {
    return this.authService.verifyLogin(body.email, body.code);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() body: { token: string; newPassword: any }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification code' })
  @ApiResponse({ status: 200, description: 'Verification code resent' })
  @ApiResponse({ status: 400, description: 'User not found or email already verified' })
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Post('resend-login-verification')
  @ApiOperation({ summary: 'Resend login verification code' })
  @ApiResponse({ status: 200, description: 'Login verification code resent' })
  @ApiResponse({ status: 400, description: 'User not found or email not verified' })
  async resendLoginVerification(@Body() body: { email: string }) {
    return this.authService.resendLoginVerificationEmail(body.email);
  }
}
