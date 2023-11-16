import { ArticleType } from '@app/article/types';

export interface IArticlesResponse {
  articles: ArticleType[];
  articlesCount: number;
}
