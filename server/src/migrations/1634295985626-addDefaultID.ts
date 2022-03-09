import { MigrationInterface, QueryRunner } from "typeorm";

export class addDefaultID1634295985626 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const categoryTable = await queryRunner.getTable("category");
    const idCategoryColumn = categoryTable!.findColumnByName("id")!;
    const changedDefaultIdCategory = idCategoryColumn.clone();
    changedDefaultIdCategory.default = "uuid_generate_v4()";
    await queryRunner.changeColumn(
      categoryTable!,
      idCategoryColumn,
      changedDefaultIdCategory
    );

    const historyTable = await queryRunner.getTable("history");
    const idHistoryColumn = historyTable!.findColumnByName("id")!;
    const changedDefaultIdHistory = idHistoryColumn.clone();
    changedDefaultIdHistory.default = "uuid_generate_v4()";
    await queryRunner.changeColumn(
      historyTable!,
      idHistoryColumn,
      changedDefaultIdHistory
    );

    const communalTable = await queryRunner.getTable("communal");
    const idCommunalColumn = communalTable!.findColumnByName("id")!;

    const changedDefaultIdCommunal = idCommunalColumn.clone();

    changedDefaultIdCommunal.default = "uuid_generate_v4()";
    await queryRunner.changeColumn(
      communalTable!,
      idCommunalColumn,
      changedDefaultIdCommunal
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const categoryTable = await queryRunner.getTable("category");
    const idCategoryColumn = categoryTable!.findColumnByName("id")!;
    const changedDefaultIdCategory = idCategoryColumn.clone();
    changedDefaultIdCategory.default = undefined;
    await queryRunner.changeColumn(
      categoryTable!,
      idCategoryColumn,
      changedDefaultIdCategory
    );

    const historyTable = await queryRunner.getTable("history");
    const idHistoryColumn = historyTable!.findColumnByName("id")!;
    const changedDefaultIdHistory = idHistoryColumn.clone();
    changedDefaultIdHistory.default = undefined;
    await queryRunner.changeColumn(
      historyTable!,
      idHistoryColumn,
      changedDefaultIdHistory
    );

    const communalTable = await queryRunner.getTable("communal");
    const idCommunalColumn = communalTable!.findColumnByName("id")!;

    const changedDefaultIdCommunal = idCommunalColumn.clone();

    changedDefaultIdCommunal.default = undefined;
    await queryRunner.changeColumn(
      communalTable!,
      idCommunalColumn,
      changedDefaultIdCommunal
    );
  }
}
