import { MigrationInterface, QueryRunner } from "typeorm"

export class AddImageurlCategory1700097634701 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
                ALTER TABLE category ADD image varchar(255);
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
                ALTER TABLE category DROP image;
            `);
    }

}
