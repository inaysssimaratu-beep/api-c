import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,

  UseGuards, Get, Req,} from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request: any) {
    return {
      id: request.user.sub,
      email: request.user.email,
      role: request.user.role,
    };
  }

@Post('forgot-password')
@HttpCode(HttpStatus.OK)
forgotPassword(@Body() dto: ForgotPasswordDto) {
  return this.authService.forgotPassword(dto);
}

@Post('reset-password')
@HttpCode(HttpStatus.OK)
resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto);
}

}
