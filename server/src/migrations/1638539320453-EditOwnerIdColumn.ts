import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class EditOwnerIdColumn1638539320453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("wish_list");
    const foreignKey = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("owner_id") !== -1
    );
    await queryRunner.dropForeignKey("wish_list", foreignKey!);
    await queryRunner.dropColumn("wish_list", "owner_id");

    await queryRunner.addColumn(
      "user_wish_list",
      new TableColumn({
        name: "is_owner",
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
        name: "owner_id",
        type: "uuid",
        isNullable: false,
      })
    );

    await queryRunner.createForeignKey(
      "wish_list",
      new TableForeignKey({
        columnNames: ["owner_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );
  }
}
