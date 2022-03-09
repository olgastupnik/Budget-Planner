import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialSchema1633696569588 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
            isPrimary: true,
          },
          {
            name: "first_name",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "last_name",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            length: "100",
            isNullable: false,
            isUnique: true,
          },

          {
            name: "password",
            type: "varchar",
            length: "100",
            isNullable: false,
          },

          {
            name: "avatar",
            type: "varchar",
            length: "300",
            default: null,
            isNullable: true,
          },
          {
            name: "budget_amount",
            type: "numeric",
            scale: 4,
            precision: 15,
            default: 0,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "history",
        columns: [
          {
            name: "id",
            type: "uuid",
            generationStrategy: "uuid",
            isPrimary: true,
          },
          {
            name: "amount",
            type: "numeric",
            scale: 4,
            precision: 15,
          },
          {
            name: "type",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "category",
        columns: [
          {
            name: "id",
            type: "uuid",
            generationStrategy: "uuid",
            isPrimary: true,
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
            name: "is_default",
            type: "boolean",
            default: false,
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "communal",
        columns: [
          {
            name: "id",
            type: "uuid",
            generationStrategy: "uuid",
            isPrimary: true,
          },
          {
            name: "timestamp",
            type: "TIMESTAMP",
          },
          {
            name: "description",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "bills",
            type: "jsonb",
          },
          {
            name: "total",
            type: "numeric",
            scale: 4,
            precision: 15,
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "history"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "communal"`);
  }
}
