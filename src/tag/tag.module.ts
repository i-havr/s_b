import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TagEntity } from '@app/tag/tag.entity';
import { TagController } from '@app/tag/tag.controller';
import { TagService } from '@app/tag/tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
