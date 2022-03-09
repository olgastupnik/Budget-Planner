import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from "typeorm";

export class AddUserWishList1638281517724 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_wish_list",
        columns: [
          {
            name: "wish_list_id",
            type: "uuid",
            isPrimary: true,
            
          },
          {
            name: "user_id",
            type: "uuid",
            isPrimary: true,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "user_wish_list",
      new TableForeignKey({
        columnNames: ["wish_list_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "wish_list",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "user_wish_list",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_wish_list"`);
  }
}
