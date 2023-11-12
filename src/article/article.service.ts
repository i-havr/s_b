import { UserEntity } from '@app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    // ЗАГЛУШКА ========================
    newArticle.slug = 'ZAGLUSHKA';
    // ===============================

    newArticle.author = currentUser; // у сутності article немає поля author, але typeorm розуміє, що стаття відноситься до конкретно цього автора, тому не треба вказувати щось типу
    // article.userId = currentUser.id
    // а потім ще довелося б зберігати типу articleRepository.save()

    return await this.articleRepository.save(newArticle);
  }
}
