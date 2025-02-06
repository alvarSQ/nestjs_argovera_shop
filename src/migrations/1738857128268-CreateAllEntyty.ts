import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllEntyty1738857128268 implements MigrationInterface {
    name = 'CreateAllEntyty1738857128268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "image" character varying NOT NULL, "seoDescription" character varying NOT NULL DEFAULT '', "seoKeywords" character varying NOT NULL DEFAULT '', "seoCanonical" character varying NOT NULL DEFAULT '', "mpath" character varying DEFAULT '', "parentId" integer, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "image" character varying NOT NULL, "seoDescription" character varying NOT NULL DEFAULT '', "seoKeywords" character varying NOT NULL DEFAULT '', "seoCanonical" character varying NOT NULL DEFAULT '', CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "price" integer NOT NULL, "slug" character varying NOT NULL, "image" character varying NOT NULL, "scores" integer NOT NULL DEFAULT '0', "code" integer NOT NULL DEFAULT '0', "discountPercentage" integer NOT NULL DEFAULT '15', "rating" integer NOT NULL DEFAULT '0', "voices" integer NOT NULL DEFAULT '0', "views" integer NOT NULL DEFAULT '0', "weigh" numeric NOT NULL DEFAULT '0.1', "reviews" text NOT NULL DEFAULT '', "visibility" boolean NOT NULL DEFAULT true, "favorites" boolean NOT NULL DEFAULT false, "seoDescription" character varying NOT NULL DEFAULT '', "seoKeywords" character varying NOT NULL DEFAULT '', "seoCanonical" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "categoriesId" integer, "brandsId" integer, CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "body" character varying NOT NULL DEFAULT '', "views" integer NOT NULL DEFAULT '0', "reviews" text NOT NULL DEFAULT '', "visibility" boolean NOT NULL DEFAULT true, "favorites" boolean NOT NULL DEFAULT false, "image" character varying NOT NULL DEFAULT '', "seoDescription" character varying NOT NULL DEFAULT '', "seoKeywords" character varying NOT NULL DEFAULT '', "seoCanonical" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_3a9ea78a0f8110a3618098dc39b" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_70cafb2f9d22e181c2ae6560f65" FOREIGN KEY ("brandsId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_70cafb2f9d22e181c2ae6560f65"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_3a9ea78a0f8110a3618098dc39b"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
