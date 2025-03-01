import { MigrationInterface, QueryRunner } from "typeorm";

export class EditCartEntyty1740826787647 implements MigrationInterface {
    name = 'EditCartEntyty1740826787647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`brands\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`reviews\` \`reviews\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`cart_entity\` DROP COLUMN \`totalAmount\``);
        await queryRunner.query(`ALTER TABLE \`cart_entity\` ADD \`totalAmount\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` CHANGE \`quantity\` \`quantity\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` ADD \`price\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` ADD CONSTRAINT \`FK_f5ba5991f20d1b82b8d88d193fb\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` DROP FOREIGN KEY \`FK_f5ba5991f20d1b82b8d88d193fb\``);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` ADD \`price\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` CHANGE \`quantity\` \`quantity\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`cart_entity\` DROP COLUMN \`totalAmount\``);
        await queryRunner.query(`ALTER TABLE \`cart_entity\` ADD \`totalAmount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`reviews\` \`reviews\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`brands\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`description\` \`description\` text NOT NULL`);
    }

}
