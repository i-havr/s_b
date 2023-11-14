import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKindergartenEntity1699972597243 implements MigrationInterface {
    name = 'AddKindergartenEntity1699972597243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "kindergarten" TO "kindergartenId"`);
        await queryRunner.query(`CREATE TABLE "kindergartens" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "fullName" character varying NOT NULL DEFAULT '', "additionalInfo" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "allowedUntil" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ca1dbb46fec45be055fd3e49708" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e5a6a4b348cb2b25f9a9e82a3e7" FOREIGN KEY ("kindergartenId") REFERENCES "kindergartens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e5a6a4b348cb2b25f9a9e82a3e7"`);
        await queryRunner.query(`DROP TABLE "kindergartens"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "kindergartenId" TO "kindergarten"`);
    }

}
