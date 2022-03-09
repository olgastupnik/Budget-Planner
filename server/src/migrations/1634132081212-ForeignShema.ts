import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class ForeignShema1634132081212 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "communal",
      new TableColumn({
        name: "user_id",
        type: "uuid",
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      "history",
      new TableColumn({
        name: "user_id",
        type: "uuid",
      })
    );

    await queryRunner.addColumn(
      "history",
      new TableColumn({
        name: "category_id",
        type: "uuid",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "communal",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "history",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "history",
      new TableForeignKey({
        columnNames: ["category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "category",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("communal", "user_id");
    await queryRunner.dropColumn("history", "user_id");
    await queryRunner.dropColumn("history", "category_id");
  }
}
