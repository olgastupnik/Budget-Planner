import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddHistoryFK1638282334314 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "history",
      new TableColumn({
        name: "wish_list_id",
        type: "uuid",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "history",
      new TableForeignKey({
        columnNames: ["wish_list_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "wish_list",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("history", "wish_list_id");
  }
}
