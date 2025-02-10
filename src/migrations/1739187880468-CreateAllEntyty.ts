import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllEntyty1739187880468 implements MigrationInterface {
    name = 'CreateAllEntyty1739187880468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`articles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`image\` varchar(255) NOT NULL DEFAULT '', \`seoDescription\` varchar(255) NOT NULL DEFAULT '', \`seoKeywords\` varchar(255) NOT NULL DEFAULT '', \`body\` varchar(255) NOT NULL DEFAULT '', \`views\` int NOT NULL DEFAULT '0', \`visibility\` tinyint NOT NULL DEFAULT 1, \`favoritesCount\` int NOT NULL DEFAULT '0', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_1123ff6815c5b8fec0ba9fec37\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`image\` varchar(255) NOT NULL DEFAULT '', \`seoDescription\` varchar(255) NOT NULL DEFAULT '', \`seoKeywords\` varchar(255) NOT NULL DEFAULT '', \`mpath\` varchar(255) NULL DEFAULT '', \`parentId\` int NULL, UNIQUE INDEX \`IDX_420d9f679d41281f282f5bc7d0\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`brands\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`image\` varchar(255) NOT NULL DEFAULT '', \`seoDescription\` varchar(255) NOT NULL DEFAULT '', \`seoKeywords\` varchar(255) NOT NULL DEFAULT '', UNIQUE INDEX \`IDX_b15428f362be2200922952dc26\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`image\` varchar(255) NOT NULL DEFAULT '', \`seoDescription\` varchar(255) NOT NULL DEFAULT '', \`seoKeywords\` varchar(255) NOT NULL DEFAULT '', \`price\` int NOT NULL, \`scores\` int NOT NULL DEFAULT '0', \`code\` int NOT NULL DEFAULT '0', \`discountPercentage\` int NOT NULL DEFAULT '15', \`rating\` int NOT NULL DEFAULT '0', \`voices\` int NOT NULL DEFAULT '0', \`views\` int NOT NULL DEFAULT '0', \`weigh\` decimal NOT NULL DEFAULT '0', \`reviews\` text NOT NULL DEFAULT '', \`visibility\` tinyint NOT NULL DEFAULT 1, \`favoritesCount\` int NOT NULL DEFAULT '0', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`categoriesId\` int NULL, \`brandsId\` int NULL, UNIQUE INDEX \`IDX_464f927ae360106b783ed0b410\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL DEFAULT '', \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_favorites_product_products\` (\`usersId\` int NOT NULL, \`productsId\` int NOT NULL, INDEX \`IDX_76721ba0b1b8c87ee04e227f3d\` (\`usersId\`), INDEX \`IDX_bc11107101e55bdc50d142e725\` (\`productsId\`), PRIMARY KEY (\`usersId\`, \`productsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_favorites_article_articles\` (\`usersId\` int NOT NULL, \`articlesId\` int NOT NULL, INDEX \`IDX_65f788e679e5b954e11f98ca7d\` (\`usersId\`), INDEX \`IDX_1e8942137cd475953ced19e8e8\` (\`articlesId\`), PRIMARY KEY (\`usersId\`, \`articlesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_9a6f051e66982b5f0318981bcaa\` FOREIGN KEY (\`parentId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_3a9ea78a0f8110a3618098dc39b\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_70cafb2f9d22e181c2ae6560f65\` FOREIGN KEY (\`brandsId\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_favorites_product_products\` ADD CONSTRAINT \`FK_76721ba0b1b8c87ee04e227f3de\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_favorites_product_products\` ADD CONSTRAINT \`FK_bc11107101e55bdc50d142e7259\` FOREIGN KEY (\`productsId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_favorites_article_articles\` ADD CONSTRAINT \`FK_65f788e679e5b954e11f98ca7de\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_favorites_article_articles\` ADD CONSTRAINT \`FK_1e8942137cd475953ced19e8e85\` FOREIGN KEY (\`articlesId\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_favorites_article_articles\` DROP FOREIGN KEY \`FK_1e8942137cd475953ced19e8e85\``);
        await queryRunner.query(`ALTER TABLE \`users_favorites_article_articles\` DROP FOREIGN KEY \`FK_65f788e679e5b954e11f98ca7de\``);
        await queryRunner.query(`ALTER TABLE \`users_favorites_product_products\` DROP FOREIGN KEY \`FK_bc11107101e55bdc50d142e7259\``);
        await queryRunner.query(`ALTER TABLE \`users_favorites_product_products\` DROP FOREIGN KEY \`FK_76721ba0b1b8c87ee04e227f3de\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_70cafb2f9d22e181c2ae6560f65\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_3a9ea78a0f8110a3618098dc39b\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_9a6f051e66982b5f0318981bcaa\``);
        await queryRunner.query(`DROP INDEX \`IDX_1e8942137cd475953ced19e8e8\` ON \`users_favorites_article_articles\``);
        await queryRunner.query(`DROP INDEX \`IDX_65f788e679e5b954e11f98ca7d\` ON \`users_favorites_article_articles\``);
        await queryRunner.query(`DROP TABLE \`users_favorites_article_articles\``);
        await queryRunner.query(`DROP INDEX \`IDX_bc11107101e55bdc50d142e725\` ON \`users_favorites_product_products\``);
        await queryRunner.query(`DROP INDEX \`IDX_76721ba0b1b8c87ee04e227f3d\` ON \`users_favorites_product_products\``);
        await queryRunner.query(`DROP TABLE \`users_favorites_product_products\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_464f927ae360106b783ed0b410\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_b15428f362be2200922952dc26\` ON \`brands\``);
        await queryRunner.query(`DROP TABLE \`brands\``);
        await queryRunner.query(`DROP INDEX \`IDX_420d9f679d41281f282f5bc7d0\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_1123ff6815c5b8fec0ba9fec37\` ON \`articles\``);
        await queryRunner.query(`DROP TABLE \`articles\``);
    }

}
