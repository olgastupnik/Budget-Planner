import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from "typeorm";

export class UserCategory1634285931187 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_categories",
        columns: [
          {
            name: "category_id",
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
      "user_categories",
      new TableForeignKey({
        columnNames: ["category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "category",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "user_categories",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_categories"`);
  }
}
