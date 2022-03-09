import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDefaultData1634544334288 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const communalTable = await queryRunner.getTable("communal");
    const timestampColumn = communalTable!.findColumnByName("timestamp")!;
    const changedtimestampColumn = timestampColumn.clone();
    changedtimestampColumn.default = "now()";
    await queryRunner.changeColumn(
      communalTable!,
      timestampColumn,
      changedtimestampColumn
    );

    await queryRunner.dropColumn("communal", "description");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const communalTable = await queryRunner.getTable("communal");
    const timestampColumn = communalTable!.findColumnByName("timestamp")!;
    const changedtimestampColumn = timestampColumn.clone();
    changedtimestampColumn.default = undefined;
    await queryRunner.changeColumn(
      communalTable!,
      timestampColumn,
      changedtimestampColumn
    );
    await queryRunner.addColumn(
      "communal",
      new TableColumn({
        name: "description",
        type: "varchar",
        length: "500",
        isNullable: false,
      })
    );
  }
}
