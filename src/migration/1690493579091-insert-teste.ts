import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTeste1690493579091 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
                INSERT INTO public."user"(
                    name, email, cpf, type_user, phone, password)
                    VALUES ('teste', 'teste@teste.com', '12345678901', 2, '31925325252', '$2b$10$BhaMKrzUdPJFaHLcdvls7.lFMHojH9/sG/jwrp.Is0YXIlpBe4gI.');
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
                DELETE FROM public."user"
                    WHERE email like 'teste@teste.com';
            `);
  }
}
