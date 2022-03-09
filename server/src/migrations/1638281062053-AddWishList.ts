import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddWishList1638281062053 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "wish_list",
        columns: [
          {
            name: "id",
            type: "uuid",
            generationStrategy: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "photo",
            type: "varchar",
            length: "300",
            isNullable: true,
            default: null,
          },
          {
            name: "title",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "description",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "is_favorite",
            type: "boolean",
            default: false,
            isNullable: false,
          },
          {
            name: "current_amount",
            type: "numeric",
            scale: 4,
            precision: 15,
            isNullable: false,
            default: 0,
          },
          {
            name: "total_amount",
            type: "numeric",
            scale: 4,
            precision: 15,
            isNullable: false,
          },
        ],
      })
    );

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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "wish_list"`);
  }
}
