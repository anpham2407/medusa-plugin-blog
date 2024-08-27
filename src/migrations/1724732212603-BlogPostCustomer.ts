import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class BlogPostCustomer1724732212603 implements MigrationInterface {
    name = "BlogPostCustomer1724732212603"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`Alter table "blog_post" 
        ADD COLUMN "customer_id" character varying NOT NULL`)

        await queryRunner.createForeignKey("blog_post", new TableForeignKey({
            columnNames: ["customer_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "customer",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
