import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateArticles1699786470268 implements MigrationInterface {
    name = 'CreateArticles1699786470268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'none'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "group" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "group" SET DEFAULT '[""]'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT '["none"]'`);
    }

}
