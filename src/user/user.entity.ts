import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcrypt';

import { UserRoleType } from '@app/types';
import { ArticleEntity } from '@app/article/article.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  // @Column({ type: 'text', array: true, default: ['none'] })
  // role: UserRoleType[];

  @Column({ type: 'simple-array', default: 'none' })
  role: UserRoleType[];

  @Column({ nullable: true, default: undefined })
  kindergarten: number | undefined;

  // @Column({ type: 'text', array: true, default: [''] })
  // group: string[];

  @Column({ type: 'simple-array', default: '' })
  group: string[];

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];
}
