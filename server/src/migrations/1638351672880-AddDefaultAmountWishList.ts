import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultAmountWishList1638351672880
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const wishListTable = await queryRunner.getTable("wish_list");
    const idCurrentAmountColumn =
      wishListTable!.findColumnByName("current_amount")!;
    const changedDefaultIdCurrentAmount = idCurrentAmountColumn.clone();
    changedDefaultIdCurrentAmount.default = 0;
    await queryRunner.changeColumn(
      wishListTable!,
      idCurrentAmountColumn,
      changedDefaultIdCurrentAmount
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const wishListTable = await queryRunner.getTable("wish_list");
    const idCurrentAmountColumn =
      wishListTable!.findColumnByName("current_amount")!;
    const changedDefaultIdCurrentAmount = idCurrentAmountColumn.clone();
    changedDefaultIdCurrentAmount.default;
    await queryRunner.changeColumn(
      wishListTable!,
      idCurrentAmountColumn,
      changedDefaultIdCurrentAmount
    );
  }
}
