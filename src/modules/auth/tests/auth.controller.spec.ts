import * as mocks from 'node-mocks-http';

import { Test, TestingModule } from '@nestjs/testing';

import {
  ChangePasswordDtoStub,
  CreateUserDtoStub,
  CurrentUserDtoStub,
  ResetPasswordBodyDtoStub,
  ResetPasswordParamsDtoStub,
} from '@modules/users/tests/stubs';
import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthServiceMock } from '@modules/auth/tests/mocks/auth.service.mock';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const req = mocks.createRequest();
  req.user = CurrentUserDtoStub();

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useClass: AuthServiceMock }],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('Define', () => {
    it('Should define the dependencies', () => {
      expect(authController).toBeDefined();
      expect(authService).toBeDefined();
    });
  });

  describe('signUp', () => {
    it('Should create user in application', async () => {
      const authServiceSignUpSpy = jest.spyOn(authService, 'signUp');
      const result = await authController.signUp(CreateUserDtoStub());

      expect(authServiceSignUpSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('age', CreateUserDtoStub().age);
    });
  });

  describe('signIn', () => {
    it('Should create user in application', async () => {
      const authServiceSignInSpy = jest.spyOn(authService, 'signIn');
      const result = await authController.signIn(req);

      expect(authServiceSignInSpy).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('forgotPassword', () => {
    it('Should return password reset-link', async () => {
      const result = await authController.forgotPassword({
        email: 'pratham@gmail.com',
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty(
        'passwordResetLink',
        'http://localhost:3000/api/auth/reset-password/1/eyosdfksdfkd',
      );
    });
  });

  describe('resetPassword', () => {
    it('Should reset the user password', async () => {
      const result = await authController.resetPassword(
        ResetPasswordParamsDtoStub().id,
        ResetPasswordParamsDtoStub().token,
        ResetPasswordBodyDtoStub(),
      );

      expect(result).toBeUndefined();
    });
  });

  describe('changePassword', () => {
    it('Should change the user password', async () => {
      const result = await authController.changePassword(
        CurrentUserDtoStub(),
        ChangePasswordDtoStub(),
      );

      expect(result).toBeDefined();
      expect(result.message).toEqual('Password changed successfully!');
    });
  });

  describe('getAccessToken', () => {
    it('It should return accessToken using refreshToken', async () => {
      const authServiceGetAccessTokenUsingRefreshTokenSpy = jest.spyOn(
        authService,
        'getAccessTokenUsingRefreshToken',
      );
      const result = await authController.getAccessToken('sample-token');

      expect(authServiceGetAccessTokenUsingRefreshTokenSpy).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('logout', () => {
    it('Should logout user from system', async () => {
      const result = await authController.logout(CurrentUserDtoStub());
      expect(result).toBe(1);
    });
  });
});
