import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  CreateUserDtoStub,
  UpdateUserDtoStub,
  CurrentUserDtoStub,
} from '@modules/users/tests/stubs';
import { User } from '@modules/users/user.entity';
import { UsersService } from '@modules/users/users.service';
import { UserRepository } from '@modules/users/users.repository';
import { TCurrentUser } from '@modules/users/typings/current-user.type';
import { UserRepositoryMock } from '@modules/users/tests/mocks/user.repository.mock';

describe('UserService', () => {
  let service: UsersService;
  let repository: UserRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    repository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('Define', () => {
    it('Should define the UserService', () => {
      expect(service).toBeDefined();
      expect(repository).toBeDefined();
    });
  });

  describe('createUser', () => {
    it('Should create user', async () => {
      const user = await service.createUser(CreateUserDtoStub());
      expect(user).toBeDefined();
    });

    it('Should not create the user', async () => {
      // Create first user
      await service.createUser(CreateUserDtoStub());

      // Trying to create user with existing email.
      await expect(
        service.createUser(
          CreateUserDtoStub({
            firstName: 'parth',
            lastName: 'patel',
            age: 25,
            email: 'pratham@gmail.com',
            password: 'parth123',
          }),
        ),
      ).rejects.toThrow(
        new ConflictException(
          `User with email "pratham@gmail.com" already exists!`,
        ),
      );
    });
  });

  describe('fetchUsers', () => {
    it('Should return the empty list if there is no users', async () => {
      const users = await service.fetchUsers();
      expect(users).not.toBeNull();
      expect(users).toHaveLength(0);
    });

    it('Should return a list of users', async () => {
      // Insert user in application
      await service.createUser(CreateUserDtoStub());
      const users = await service.fetchUsers();
      expect(users).not.toBeNull();
      expect(users).not.toHaveLength(0);
      expect(users[0]).toHaveProperty('firstName', 'Prathamesh');
    });
  });

  describe('findUserById', () => {
    it('should not find the user with id 1', async () => {
      const user = await service.findUserById(1);
      expect(user).toBeNull();
    });

    it('should find the user with id 1', async () => {
      await service.createUser(CreateUserDtoStub());
      const user = await service.findUserById(1);
      expect(user).not.toBeNull();
    });
  });

  describe('findUserByEmail', () => {
    it('should not find the user with email : parth@gmail.com', async () => {
      const user = await service.findUserByEmail('parth@gmail.com');
      expect(user).toBeNull();
    });

    it('should find the user with email : pratham@gmail.com', async () => {
      await service.createUser(CreateUserDtoStub());
      const user = await service.findUserByEmail('pratham@gmail.com');
      expect(user).not.toBeNull();
      expect(user).toHaveProperty('firstName', CreateUserDtoStub().firstName);
      expect(user).toHaveProperty('email', CreateUserDtoStub().email);
    });
  });

  describe('saveUser', () => {
    it('Should save user to database', async () => {
      const user = await service.saveUser(new User(CreateUserDtoStub()));

      expect(user).toBeDefined();
      expect(user).toHaveProperty('firstName', CreateUserDtoStub().firstName);
      expect(user).toHaveProperty('lastName', CreateUserDtoStub().lastName);
      expect(user).toHaveProperty('email', CreateUserDtoStub().email);
      expect(user).toHaveProperty('age', CreateUserDtoStub().age);
    });
  });

  describe('updateUser', () => {
    const userId = 1;

    it('should throw user not found error', async () => {
      await expect(
        service.updateUser(userId, UpdateUserDtoStub()),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.updateUser(userId, UpdateUserDtoStub()),
      ).rejects.toThrow(new NotFoundException(`No such user found with 1 id.`));
    });

    it('should update the user details', async () => {
      await service.createUser(CreateUserDtoStub());
      const updatedUser = await service.updateUser(1, UpdateUserDtoStub());

      expect(updatedUser).toHaveProperty('age', UpdateUserDtoStub().age);
      expect(updatedUser).toHaveProperty('email', UpdateUserDtoStub().email);
      expect(updatedUser).toHaveProperty('id', 1);
    });
  });

  describe('deleteUser', () => {
    const currentUser: TCurrentUser = CurrentUserDtoStub();
    const inputUserData = CreateUserDtoStub({ id: 2 });

    it('Should throw NotFoundException for wrong user id', async () => {
      await expect(service.deleteUser(currentUser, 1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.deleteUser(currentUser, 1)).rejects.toThrow(
        new NotFoundException(`No such user found with id : 1`),
      );
    });

    it('Should Throw UnAuthorized Exception', async () => {
      await service.createUser(inputUserData);
      await expect(service.deleteUser(currentUser, 2)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.deleteUser(currentUser, 2)).rejects.toThrow(
        new UnauthorizedException(
          `You don't have sufficient access to delete this user.`,
        ),
      );
    });

    it(`Should delete the user`, async () => {
      currentUser.role = 'admin';
      await service.createUser(inputUserData);
      const result = await service.deleteUser(currentUser, 2);

      expect(result).toHaveProperty('message', 'User delete successfully.');
    });
  });
});
