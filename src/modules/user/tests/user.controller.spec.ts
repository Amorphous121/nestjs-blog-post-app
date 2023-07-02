import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  CreateUserDtoStub,
  CurrentUserDtoStub,
  UpdateUserDtoStub,
} from '@modules/user/tests/stubs';
import { UserService } from '@modules/user/user.service';
import { UserController } from '@modules/user/user.controller';
import { UserServiceMock } from '@modules/user/tests/mocks/user.service.mock';

describe('UserController', () => {
  let userService: UserService;
  let userController: UserController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useClass: UserServiceMock }],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('Define', () => {
    it('Should define all dependencies', () => {
      expect(userService).toBeDefined();
      expect(userController).toBeDefined();
    });
  });

  describe('getUsers', () => {
    it('Should return list of users', async () => {
      await userService.createUser(CreateUserDtoStub());
      const results = await userController.getUsers();

      expect(results).toBeDefined();
      expect(results).toHaveProperty('length');
      expect(results[0]).toHaveProperty('age', 24);
      expect(results[0]).toHaveProperty('password', '1234');
      expect(results[0]).toHaveProperty('lastName', 'Patil');
      expect(results[0]).toHaveProperty('firstName', 'Prathamesh');
      expect(results[0]).toHaveProperty('email', 'pratham@gmail.com');
    });
  });

  describe('getUserById', () => {
    it('Should throw NotFoundException for wrong userId', async () => {
      await expect(userController.getUserById(1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(userController.getUserById(1)).rejects.toThrow(
        new NotFoundException('No such user exists with id : 1'),
      );
    });

    it('Should return the user found by id', async () => {
      await userService.createUser(CreateUserDtoStub());
      const result = await userController.getUserById(1);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('age', 24);
      expect(result).toHaveProperty('lastName', 'Patil');
      expect(result).toHaveProperty('firstName', 'Prathamesh');
      expect(result).toHaveProperty('email', 'pratham@gmail.com');
    });
  });

  describe('updateUserInfo', () => {
    it('Should update user info', async () => {
      const result = await userController.updateUserInfo(
        1,
        UpdateUserDtoStub(),
        CurrentUserDtoStub(),
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty('age', UpdateUserDtoStub().age);
      expect(result).toHaveProperty('email', UpdateUserDtoStub().email);
      expect(result).toHaveProperty('firstName', UpdateUserDtoStub().firstName);
      expect(result).toHaveProperty('lastName', UpdateUserDtoStub().lastName);
    });
  });

  describe('deleteUser', () => {
    it('Should delete user', async () => {
      const result = await userController.deleteUser(CurrentUserDtoStub(), 1);
      expect(result).toHaveProperty('message', 'User delete successfully.');
    });
  });
});
