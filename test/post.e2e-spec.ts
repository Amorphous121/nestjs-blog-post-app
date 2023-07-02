import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@/modules/app/app.module';
import { truncateTableFromTestDatabase } from '@/helpers/test.helper';

describe('', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await truncateTableFromTestDatabase('users');
    await truncateTableFromTestDatabase('posts');
    await app.close();
  });
});
