import { MigrationInterface, QueryRunner } from "typeorm";

export class EditUserEntity1699707629848 implements MigrationInterface {
    name = 'EditUserEntity1699707629848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kindergarten"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "kindergarten" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kindergarten"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "kindergarten" character varying NOT NULL DEFAULT ''`);
    }

}
