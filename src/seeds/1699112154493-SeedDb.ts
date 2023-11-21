import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1699112154493 implements MigrationInterface {
  name = 'SeedDb1699112154493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    // );
    await queryRunner.query(
      // password is 1234
      `INSERT INTO users (name, email, role, password) VALUES ('sadok', 'sadok@gmail.com', 'admin', '$2b$10$5ntSJva0s1woD.rr/5P6mOTBizc9QQhrA.FHTbmpdMdQxLVUPJHrq')`,
    );
    await queryRunner.query(
      // password is 1234
      `INSERT INTO users (name, email, role, password) VALUES ('Директор 1', 'director1@gmail.com', 'director', '$2b$10$EFjQG8Lk86Tc6IyPa.RR8.oVcXXl85S6cnkltKBui0.j5d5c9TtgW')`,
    );
    await queryRunner.query(
      // password is 1234
      `INSERT INTO users (name, email, role, password) VALUES ('Директор 2', 'director2@gmail.com', 'director', '$2b$10$q6B3Wj.G9DgFz7I4QOWcQuw.IthS6kjhhwJygiQxd/MZEWcAiPwXS')`,
    );
    await queryRunner.query(
      // password is 1234
      `INSERT INTO users (name, email, role, password) VALUES ('Вихователь 1', 'educator1@gmail.com', 'educator', '$2b$10$xYOsipl.kJistzdUvOZFDOjXvE8Xkkf21yxVnMfjGrieGniRN05t2')`,
    );
    await queryRunner.query(
      // password is 1234
      `INSERT INTO users (name, email, role, password) VALUES ('Батько 1', 'parent1@gmail.com', 'parent', '$2b$10$TvdQY5sgzrfhBN4/ozRgEemmEsewwVOYvYpaxNnEMkKviAxEFN3M.')`,
    );
    await queryRunner.query(
      // password is 1234
      `INSERT INTO users (name, email, password) VALUES ('Юзер без ролі', 'user1@gmail.com', '$2b$10$e2POYHya96I9pFlDwEVPn.L98zyPtp7azS4GiIgAh.KjbJd8VVJKy')`,
    );

    // await queryRunner.query(
    //   `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First article title', 'first article description', 'first article body', 'cofee, dragons', 1)`,
    // );
    // await queryRunner.query(
    //   `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'Second article title', 'second article description', 'second article body', 'cofee, dragons', 1)`,
    // );
  }

  public async down(): Promise<void> {}
}
