import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCodeInProd1738399456872 implements MigrationInterface {
    name = 'AddCodeInProd1738399456872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "code" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "code"`);
    }

}
