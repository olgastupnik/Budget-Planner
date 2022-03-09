import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { ROLES_TYPE } from "../constants";

export class AddRole1635510298362 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "role",
        type: "varchar",
        isNullable: false,
        default: `'${ROLES_TYPE.USER}'`,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "role");
  }
}
