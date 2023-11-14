import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';

import { UserEntity } from '@app/user/user.entity';

import { ArticleEntity } from '@app/article/article.entity';
import { CreateArticleDto } from '@app/article/dto';
import { IArticleResponse } from '@app/article/types';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}
  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const newArticle = new ArticleEntity();

    Object.assign(newArticle, createArticleDto);

    if (!newArticle.tagList) {
      newArticle.tagList = [];
    }

    newArticle.slug = this.getSlug(createArticleDto.title);

    newArticle.author = currentUser; // у сутності article немає поля author, але typeorm розуміє, що стаття відноситься до конкретно цього автора, тому не треба вказувати щось типу
    // article.userId = currentUser.id
    // а потім ще довелося б зберігати типу articleRepository.save()

    return await this.articleRepository.save(newArticle);
  }

  async findArticleBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({
      where: { slug },
    });
  }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article };
  }

  // метод getSlug буде використаний лише у цьому сервісі і не призначений для використання десь зовні, тому ставимо private. Цей метод повертає робить slug із title та додає у кінці рядок типу "f3hh3h", що робить slug УНІКАЛЬНИМ.
  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
