import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/user/user.entity';
import { UserController } from '@app/user/user.controller';
import { UserService } from '@app/user/user.service';

import { AuthGuard } from '@app/user/guards';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
