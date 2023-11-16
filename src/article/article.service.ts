import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import slugify from 'slugify';

import { UserEntity } from '@app/user/user.entity';

import { ArticleEntity } from '@app/article/article.entity';
import { CreateArticleDto } from '@app/article/dto';
import { IArticleResponse, IArticlesResponse } from '@app/article/types';
import { UpdateArticleDto } from '@app/article/dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllArticles(
    currentUserId: number,
    query: any,
  ): Promise<IArticlesResponse> {
    // для роботи зі складними запитами необхідно використовувати queryBuilder. Окрім того, коли ми отримуємо масив статтей, у статтях не буде поля author, тому що queryBuilder більш низькорівневий і на нього не діє {eager: true}. Тому ми додатково приєднуємо leftJoinAndSelect.
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    // articlesCount треба завжди отримувати до інших сортувань, таких як limit / offset
    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { name: query.author },
      });

      if (!author) {
        throw new HttpException(
          'The author is not found',
          HttpStatus.NOT_FOUND,
        );
      }

      queryBuilder.andWhere('articles.authorId = :id', { id: author.id });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: { name: query.favorited },
        relations: ['favorites'],
      });

      const ids = author.favorites.map((el) => el.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });

      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorites, articlesCount };
  }

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

    return await this.articleRepository.save(newArticle);
  }

  async updateArticle(
    currentUserId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);

    if (!article) {
      throw new HttpException(
        'The article does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    const updatedArticle = { ...article, ...updateArticleDto };

    updatedArticle.slug = this.getSlug(updateArticleDto.title);

    return await this.articleRepository.save(updatedArticle);
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findArticleBySlug(slug);

    if (!article) {
      throw new HttpException(
        'The article does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  async findArticleBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({
      where: { slug },
    });
  }

  async addArticleToFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);

    if (!article) {
      throw new HttpException(
        'The article does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });

    const isNotFavorited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async deleteArticleFromFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);

    if (!article) {
      throw new HttpException(
        'The article does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
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
