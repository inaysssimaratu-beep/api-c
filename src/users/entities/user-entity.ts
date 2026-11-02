import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('users')
export class UserAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ default: 'user' })
  role: string;
@Column({ type: 'varchar', nullable: true, select: false })
passwordResetTokenHash: string | null;

@Column({
  type: 'timestamp with time zone',
  nullable: true,
  select: false,
})
passwordResetExpiresAt: Date | null;

}
