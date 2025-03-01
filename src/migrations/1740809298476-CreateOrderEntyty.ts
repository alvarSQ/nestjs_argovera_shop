import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderEntyty1740809298476 implements MigrationInterface {
    name = 'CreateOrderEntyty1740809298476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`paymentMethod\` varchar(255) NOT NULL, \`shippingAddress\` varchar(255) NOT NULL, \`status\` enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`totalAmount\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`cart_entity\` DROP COLUMN \`totalAmount\``);
        await queryRunner.query(`ALTER TABLE \`cart_entity\` ADD \`totalAmount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` CHANGE \`quantity\` \`quantity\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` ADD \`price\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`brands\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`reviews\` \`reviews\` text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`reviews\` \`reviews\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`brands\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`description\` \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` ADD \`price\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_item_entity\` CHANGE \`quantity\` \`quantity\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_entity\` DROP COLUMN \`totalAmount\``);
        await queryRunner.query(`ALTER TABLE \`cart_entity\` ADD \`totalAmount\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`DROP TABLE \`order_entity\``);
    }

}
