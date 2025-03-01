import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditCart1740833502137 implements MigrationInterface {
  name = 'EditCart1740833502137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`cart_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cartId\` int NOT NULL, \`productId\` int NOT NULL, \`quantity\` int NOT NULL, \`price\` decimal(10,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cart\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`totalAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`paymentMethod\` varchar(255) NOT NULL, \`shippingAddress\` varchar(255) NOT NULL, \`status\` enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`totalAmount\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`brands\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`reviews\` \`reviews\` text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`articles\` CHANGE \`description\` \`description\` text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_75db0de134fe0f9fe9e4591b7bf\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_29e590514f9941296f3a2440d39\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_29e590514f9941296f3a2440d39\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_75db0de134fe0f9fe9e4591b7bf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`articles\` CHANGE \`description\` \`description\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`reviews\` \`reviews\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`brands\` CHANGE \`description\` \`description\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE \`order\``);
    await queryRunner.query(`DROP TABLE \`cart\``);
    await queryRunner.query(`DROP TABLE \`cart_item\``);
  }
}
