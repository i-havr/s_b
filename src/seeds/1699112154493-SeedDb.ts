import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1699112154493 implements MigrationInterface {
  name = 'SeedDb1699112154493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    );
    await queryRunner.query(
      // password is 1234
      `INSERT INTO users (name, email, password) VALUES ('sadok', 'sadok@gmail.com', '$2b$10$5ntSJva0s1woD.rr/5P6mOTBizc9QQhrA.FHTbmpdMdQxLVUPJHrq')`,
    );
    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First article title', 'first article description', 'first article body', 'cofee, dragons', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'Second article title', 'second article description', 'second article body', 'cofee, dragons', 1)`,
    );
  }

  public async down(): Promise<void> {}
}
