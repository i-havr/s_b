import { ArticleEntity } from '@app/article/article.entity';

export interface IArticlesResponse {
  articles: ArticleEntity[];
  articlesCount: number;
}
