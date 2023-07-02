import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@/modules/app/app.module';
import { CreateUserDtoStub } from '@/modules/user/tests/stubs';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('AuthController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Define', () => {
    it('Should define the application', async () => {
      expect(app).toBeDefined();
    });
  });

  describe('/sign-up auth', () => {
    const createUserDto = CreateUserDtoStub();

    it('Should create user in database', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(createUserDto);

      expect(response.status).toBeDefined();
      expect(response.status).toBe(201);
    });
  });
});
