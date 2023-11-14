import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KindergartenEntity } from './kindergarten.entity';
import { KindergartenController } from './kindergarten.controller';
import { KindergartenService } from './kindergarten.service';

@Module({
  imports: [TypeOrmModule.forFeature([KindergartenEntity])],
  controllers: [KindergartenController],
  providers: [KindergartenService],
})
export class KindergartenModule {}
