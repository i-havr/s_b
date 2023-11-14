import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AdminGuard } from '@app/user/guards';

import { KindergartenService } from '@app/kindergarten/kindergarten.service';
import { IKindergartenResponse } from '@app/kindergarten/types';
import { CreateKindergartenDto } from '@app/kindergarten/dto';

@Controller('kindergartens')
export class KindergartenController {
  constructor(private readonly kindergartenService: KindergartenService) {}

  @Post()
  @UseGuards(AdminGuard)
  async createKindergarten(
    @Body('kindergarten') createKindergartenDto: CreateKindergartenDto,
  ): Promise<IKindergartenResponse> {
    const kindergarten = await this.kindergartenService.createKindergarten(
      createKindergartenDto,
    );

    return this.kindergartenService.buildArticleResponse(kindergarten);
  }
}
