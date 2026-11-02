import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user-entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly users: Repository<UserAccount>,
  ) {}

  async findUserByEmail(email: string) {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', {
        email: email.trim().toLowerCase(),
      })
      .getOne();
  }

  async createUser(
    name: string,
    email: string,
    passwordHash: string,
  ) {
    const user = this.users.create({
      name,
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'user',
    });

    return this.users.save(user);
  }

  async updateUserPassword(
    email: string,
    passwordHash: string,
  ) {
    return this.users.update(
      { email: email.trim().toLowerCase() },
      { passwordHash },
    );
  }

async savePasswordReset(email: string, hash: string) {
  return this.users.update(
    { email: email.trim().toLowerCase() },
    {
      passwordResetTokenHash: hash,
      passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  );
}

async resetPasswordByTokenHash(
  tokenHash: string,
  passwordHash: string,
) {
  const result = await this.users
    .createQueryBuilder()
    .update(UserAccount)
    .set({
      passwordHash,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    })
    .where('"passwordResetTokenHash" = :tokenHash', { tokenHash })
    .andWhere('"passwordResetExpiresAt" > :now', {
      now: new Date(),
    })
    .execute();

  return (result.affected ?? 0) > 0;
}

}
