import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsers1738329466366 implements MigrationInterface {
    name = 'AddUsers1738329466366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "slug" character varying NOT NULL, "image" character varying NOT NULL, "seoDescription" integer NOT NULL, "seoKeywords" character varying NOT NULL, "seoCanonical" character varying NOT NULL, CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "slug" character varying NOT NULL, "scores" integer NOT NULL, "discountPercentage" integer NOT NULL, "rating" integer NOT NULL, "voices" integer NOT NULL, "views" integer NOT NULL, "weigh" integer NOT NULL, "reviews" text NOT NULL, "visibility" boolean NOT NULL, "favorites" boolean NOT NULL, "image" character varying NOT NULL, "seoDescription" integer NOT NULL, "seoKeywords" character varying NOT NULL, "seoCanonical" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" integer, "brandId" integer, CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "slug" character varying NOT NULL, "image" character varying NOT NULL, "seoDescription" integer NOT NULL, "seoKeywords" character varying NOT NULL, "seoCanonical" character varying NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
