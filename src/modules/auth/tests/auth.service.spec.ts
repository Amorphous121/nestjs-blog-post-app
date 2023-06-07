import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import {
  SignInDtoStub,
  CreateUserDtoStub,
  CurrentUserDtoStub,
  ResetPasswordParamsDtoStub,
  ResetPasswordBodyDtoStub,
  ChangePasswordDtoStub,
} from '@modules/users/tests/stubs';
import { JwtHelper } from '@utils/jwt.util';
import { RedisUtils } from '@utils/redis.util';
import { AuthService } from '@modules/auth/auth.service';
import { UsersService } from '@modules/users/users.service';
import { JwtHelperMock } from '@utils/tests/mocks/jwt.util.mock';
import { RedisUtilsMock } from '@utils/tests/mocks/redis.util.mock';
import { UserServiceMock } from '@modules/users/tests/mocks/user.service.mock';
import { ConfigServiceMock } from '@modules/auth/tests/mocks/config.service.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useClass: UserServiceMock,
        },
        {
          provide: ConfigService,
          useClass: ConfigServiceMock,
        },
        {
          provide: JwtHelper,
          useClass: JwtHelperMock,
        },
        {
          provide: RedisUtils,
          useClass: RedisUtilsMock,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
  });

  describe('Define', () => {
    it('Should define AuthService', () => {
      expect(authService).toBeDefined();
      expect(userService).toBeDefined();
    });
  });

  describe('signUp', () => {
    it('Should create user', async () => {
      const createUserSpy = jest.spyOn(userService, 'createUser');
      const user = await authService.signUp(CreateUserDtoStub());

      expect(createUserSpy).toHaveBeenCalled();
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id', 1);
      expect(user.firstName).toBeDefined();
      expect(user).toHaveProperty('age', CreateUserDtoStub().age);
    });
  });

  describe('signIn', () => {
    it('Should return the JWT Credentials for current user', async () => {
      const result = await authService.signIn(CurrentUserDtoStub());

      expect(result).toBeDefined();
      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toContain('Bearer');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('forgotPassword', () => {
    it('Should throw NotFoundException', async () => {
      await expect(
        authService.forgotPassword({ email: 'pratham@gmail.com' }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        authService.forgotPassword({ email: 'pratham@gmail.com' }),
      ).rejects.toThrow(
        new NotFoundException(`No such user found with "pratham@gmail.com"`),
      );
    });

    it('Should Return the password reset link', async () => {
      await authService.signUp(CreateUserDtoStub());
      const result = await authService.forgotPassword({
        email: 'pratham@gmail.com',
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('passwordResetLink');
      expect(result.passwordResetLink).toContain('api/auth/reset-password');
    });
  });

  describe('logoutUser', () => {
    it('Should logout user from system', async () => {
      const result = await authService.logoutUser(CurrentUserDtoStub());
      expect(result).toBeDefined();
      expect(result).toBe(1);
    });
  });

  describe('resetPassword', () => {
    const resetPasswordBodyDto = ResetPasswordBodyDtoStub();
    const resetPasswordParamsDto = ResetPasswordParamsDtoStub();

    it('Should through BadRequestException', async () => {
      await expect(
        authService.resetPassword(resetPasswordParamsDto, resetPasswordBodyDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        authService.resetPassword(resetPasswordParamsDto, resetPasswordBodyDto),
      ).rejects.toThrow(new BadRequestException('Invalid link!'));
    });

    it('Should through BadRequestException for invalid token', async () => {
      await authService.signUp(CreateUserDtoStub());
      await expect(
        authService.resetPassword(
          { ...resetPasswordParamsDto, token: 'fail' },
          resetPasswordBodyDto,
        ),
      ).rejects.toThrow(BadRequestException);
      await expect(
        authService.resetPassword(
          { ...resetPasswordParamsDto, token: 'fail' },
          resetPasswordBodyDto,
        ),
      ).rejects.toThrow(new BadRequestException('Invalid link!'));
    });

    it('Should reset the user password', async () => {
      await authService.signUp(CreateUserDtoStub());
      expect(
        authService.resetPassword(
          { ...resetPasswordParamsDto, token: 'pass' },
          resetPasswordBodyDto,
        ),
      ).resolves.toBe(undefined);
    });
  });

  describe('forgotPassword', () => {
    it('Should throw BadRequestException on wrong password', async () => {
      const user = await authService.signUp(CreateUserDtoStub());
      await expect(
        authService.changePassword(ChangePasswordDtoStub(), { ...user }),
      ).rejects.toThrow(BadRequestException);
    });

    it('Should change the user password', async () => {
      const user = await authService.signUp(CreateUserDtoStub());
      const result = await authService.changePassword(
        ChangePasswordDtoStub({
          oldPassword: CreateUserDtoStub().password,
        }),
        { ...user },
      );

      expect(result).toBeDefined();
      expect(result.message).toMatch('Password changed successfully!');
    });
  });

  describe('getAccessTokenUsingRefreshToken', () => {
    it('Should throw BadRequestException', async () => {
      await expect(
        authService.getAccessTokenUsingRefreshToken('fail'),
      ).rejects.toThrow(Error);
    });

    it('Should throw UnAuthorizedException', async () => {
      await expect(
        authService.getAccessTokenUsingRefreshToken('pass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('Should return null on invalid email', async () => {
      const result = await authService.validateUser(SignInDtoStub());
      expect(result).toEqual(null);
    });

    it('Should return null on invalid password', async () => {
      await authService.signUp(CreateUserDtoStub());
      const result = await authService.validateUser({
        ...SignInDtoStub(),
        password: '123',
      });
      expect(result).toEqual(null);
    });

    it('Should validate the user credentials', async () => {
      await authService.signUp(CreateUserDtoStub());
      const result = await authService.validateUser(SignInDtoStub());
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('firstName', CreateUserDtoStub().firstName);
      expect(result).toHaveProperty('lastName', CreateUserDtoStub().lastName);
      expect(result).toHaveProperty('email', CreateUserDtoStub().email);
      expect(result).toHaveProperty('role', 'user');
    });
  });
});
