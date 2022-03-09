import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class EditFavoriteColumn1638523987424 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("wish_list", "is_favorite");

    await queryRunner.addColumn(
      "user_wish_list",
      new TableColumn({
        name: "is_favorite",
        type: "boolean",
        default: false,
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "wish_list",
      new TableColumn({
        name: "is_favorite",
        type: "boolean",
        default: false,
        isNullable: false,
      })
    );
    await queryRunner.dropColumn("user_wish_list", "is_favorite");
  }
}
