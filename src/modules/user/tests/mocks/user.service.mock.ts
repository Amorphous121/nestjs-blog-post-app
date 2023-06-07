/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@modules/user/user.entity';
import { CreateUserDto } from '@modules/user/dtos/create-user.dto';
import { UpdateUserDto } from '@modules/user/dtos/update-user.dto';
import { TCurrentUser } from '@modules/user/typings/current-user.type';

export class UserServiceMock {
  users: User[] = [];

  async createUser(createUserDto: CreateUserDto) {
    const user = new User({
      id: 1,
      ...createUserDto,
      role: 'user',
      validatePassword(pass: string) {
        return pass === this.password;
      },
    });

    this.users.push(user);
    return user;
  }

  async findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  async findUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  async saveUser(user: User) {
    return user;
  }

  async fetchUsers() {
    return this.users;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    let user = this.users.find((user) => user.id === userId);
    user = new User({ ...user, ...updateUserDto });
    this.users = this.users.map((user) =>
      user.id === userId ? new User({ ...user, ...updateUserDto }) : user,
    );
    return user;
  }

  async deleteUser(user: TCurrentUser, userId: number) {
    return { message: 'User delete successfully.' };
  }
}
