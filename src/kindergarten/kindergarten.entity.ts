import {
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { UserEntity } from '@app/user/user.entity';

@Entity({ name: 'kindergartens' })
export class KindergartenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  fullName: string;

  @Column({ default: '' })
  additionalInfo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // add logic
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  allowedUntil: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @OneToMany(() => UserEntity, (user) => user.kindergarten)
  users: UserEntity[];
}
