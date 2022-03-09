import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPermissions1638782130623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user_wish_list",
      new TableColumn({
        name: "permission",
        type: "text",
        isArray: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user_wish_list", "permission");
  }
}
