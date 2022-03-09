import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultCategories1634295839404 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO category (title, description, is_default) VALUES('Food', 'Candy', 'true')"
    );
    await queryRunner.query(
      "INSERT INTO category (title, description, is_default) VALUES('Electronics', 'Phone', 'true')"
    );
    await queryRunner.query(
      "INSERT INTO category (title, description, is_default) VALUES('Hobby', 'Swimming', 'true')"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DELETE FROM category WHERE category.is_default = 'true'"
    );
  }
}
