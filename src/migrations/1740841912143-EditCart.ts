import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditCart1740841912143 implements MigrationInterface {
  name = 'EditCart1740841912143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` ADD \`orderId\` int NULL`,
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
      `ALTER TABLE \`order\` DROP COLUMN \`totalAmount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`totalAmount\` decimal(10,2) NOT NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_26a8ff17b49cc3b5dcbdd7d357a\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_26a8ff17b49cc3b5dcbdd7d357a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`totalAmount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`totalAmount\` int NOT NULL`,
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
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` DROP COLUMN \`orderId\``,
    );
  }
}
