import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateArticles1699786296634 implements MigrationInterface {
    name = 'CreateArticles1699786296634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "body" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tagList" text NOT NULL, "favoritesCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" text NOT NULL DEFAULT '["none"]'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "group"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "group" text NOT NULL DEFAULT '[""]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "group"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "group" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" text array NOT NULL DEFAULT '{none}'`);
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}
