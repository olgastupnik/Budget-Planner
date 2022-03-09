import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUser1634116365549 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("INSERT INTO users (first_name, last_name, email, password) VALUES('Admin', 'Lastname', 'admin@test.com', '12345678' )")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM users WHERE users.email = 'admin@test.com'")
    }

}
