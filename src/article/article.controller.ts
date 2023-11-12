import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards';
import { User } from '@app/user/decorators';

import { ArticleService } from '@app/article/article.service';
import { CreateArticleDto } from '@app/article/dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createArticle(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<any> {
    return this.articleService.createArticle(currentUser, createArticleDto);
  }
}
