import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '@modules/app/app.module';
import { truncateTableFromTestDatabase } from '@/helpers/test.helper';
import {
  SignInDtoStub,
  CreateUserDtoStub,
  ChangePasswordDtoStub,
} from '@/modules/user/tests/stubs';

describe('AuthController (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('/auth/sign-up (POST)', () => {
    it('Should create a user (POST)', async () => {
      const { body: response } = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(CreateUserDtoStub())
        .expect(201);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('email', CreateUserDtoStub().email);
      expect(response).toHaveProperty('role', 'user');
    });

    it('Should throw conflict error on existing email', async () => {
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(CreateUserDtoStub())
        .expect(409);
    });
  });

  describe('/auth/sign-in (POST)', () => {
    it('Should return the JWT Credentials for loggedIn user', async () => {
      const { body: response } = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(SignInDtoStub())
        .expect(200);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('accessToken');
      expect(response.accessToken).toContain('Bearer');
      expect(response).toHaveProperty('refreshToken');
    });

    it('Should throw error on invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ ...SignInDtoStub(), password: 'abcd' })
        .expect(401);
    });
  });

  describe('/auth/forgot-password', () => {
    it('Should generate password reset link', async () => {
      const { body: response } = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: 'pratham@gmail.com',
        })
        .expect(200);

      expect(response).toHaveProperty('passwordResetLink');
    });

    it("Should throw error when email doesn't exists", () => {
      return request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: 'john@gmail.com',
        })
        .expect(404);
    });
  });

  describe('/auth/logout', () => {
    it('Should logout the user from system', async () => {
      const {
        body: { accessToken },
      } = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(SignInDtoStub());

      return await request(app.getHttpServer())
        .post('/auth/logout')
        .auth(accessToken.split(' ')[1], { type: 'bearer' })
        .expect(200);
    });
  });

  describe('/auth/reset-password/:id/:token', () => {
    it('Should reset password', async () => {
      const {
        body: { passwordResetLink },
      } = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: 'pratham@gmail.com',
        })
        .expect(200);

      await request(app.getHttpServer())
        .post(passwordResetLink.replace(`${process.env.SERVER_DOMAIN}/api`, ''))
        .send({ password: '1234', confirmPassword: '1234' })
        .expect(200);
    });

    it('Should throw error on password mismatch', async () => {
      const {
        body: { passwordResetLink },
      } = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: 'pratham@gmail.com',
        })
        .expect(200);

      await request(app.getHttpServer())
        .post(passwordResetLink.replace(`${process.env.SERVER_DOMAIN}/api`, ''))
        .send({ password: '1234', confirmPassword: '12345' })
        .expect(200);
    });
  });

  describe('/auth/refresh-token (POST)', () => {
    it('Should Return new Tokens', async () => {
      const {
        body: { refreshToken },
      } = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(SignInDtoStub());

      return request(app.getHttpServer())
        .post('/auth/refresh-token')
        .send({ refreshToken });
    });
  });

  describe('/auth/change-password (POST)', () => {
    it('Should throw error on wrong token', async () => {
      return request(app.getHttpServer())
        .post('/auth/change-password')
        .auth('Bearer FakeToken'.split(' ')[1], { type: 'bearer' })
        .send(ChangePasswordDtoStub({ oldPassword: SignInDtoStub().password }))
        .expect(401);
    });

    it('Should change password', async () => {
      const {
        body: { accessToken },
      } = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(SignInDtoStub());

      return request(app.getHttpServer())
        .post('/auth/change-password')
        .auth(accessToken.split(' ')[1], { type: 'bearer' })
        .send(ChangePasswordDtoStub({ oldPassword: SignInDtoStub().password }))
        .expect(200);
    });
  });
  afterAll(async () => {
    await truncateTableFromTestDatabase('users');
    await app.close();
  });
});
