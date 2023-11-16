import { MigrationInterface, QueryRunner } from "typeorm";

export class EditKindergartenEntity1700053081077 implements MigrationInterface {
    name = 'EditKindergartenEntity1700053081077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kindergartens" ADD "region" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "kindergartens" ADD "city" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "kindergartens" ADD "address" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kindergartens" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "kindergartens" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "kindergartens" DROP COLUMN "region"`);
    }

}
