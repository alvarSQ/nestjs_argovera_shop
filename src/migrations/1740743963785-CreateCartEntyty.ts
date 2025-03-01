import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCartEntyty1740743963785 implements MigrationInterface {
    name = 'CreateCartEntyty1740743963785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`cart_item_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cartId\` int NOT NULL, \`productId\` int NOT NULL, \`quantity\` int NOT NULL, \`price\` decimal(10,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`totalAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`brands\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`reviews\` \`reviews\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` ADD CONSTRAINT \`FK_eabcbd5dff337a605c509c85abf\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` DROP FOREIGN KEY \`FK_eabcbd5dff337a605c509c85abf\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`reviews\` \`reviews\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`brands\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`DROP TABLE \`cart_entity\``);
        await queryRunner.query(`DROP TABLE \`cart_item_entity\``);
    }

}
