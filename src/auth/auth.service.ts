import { randomBytes, createHash } from 'node:crypto';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotImplementedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findUserByEmail(
      dto.email,
    );

    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.createUser(
      dto.name,
      dto.email,
      hashedPassword,
    );

    return {
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findUserByEmail(
      dto.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Email atau password salah',
      );
    }

    const valid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!valid) {
      throw new UnauthorizedException(
        'Email atau password salah',
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Login berhasil',
      accessToken,
      tokenType: 'Bearer',
    };
  }

async forgotPassword(dto: ForgotPasswordDto) {
  if (
    process.env.NODE_ENV &&
    process.env.NODE_ENV !== 'development'
  ) {
    throw new NotImplementedException(
      'Pengiriman email reset password belum dikonfigurasi',
    );
  }

  const user = await this.usersService.findUserByEmail(dto.email);

  const message =
    'Jika email terdaftar, permintaan reset telah diproses';

  if (!user) {
    return { message };
  }

  const token = randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(token).digest('hex');

  await this.usersService.savePasswordReset(user.email, hash);

  return {
    message,
    developmentResetToken: token,
    expiresInMinutes: 15,
  };
}

async resetPassword(dto: ResetPasswordDto) {
  const hash = createHash('sha256')
    .update(dto.token)
    .digest('hex');

  const passwordHash = await bcrypt.hash(
    dto.newPassword,
    12,
  );

  const success =
    await this.usersService.resetPasswordByTokenHash(
      hash,
      passwordHash,
    );

  if (!success) {
    throw new BadRequestException(
      'Token reset tidak valid atau kedaluwarsa',
    );
  }

  return { message: 'Password berhasil diubah' };
}

}
