/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@modules/user/user.entity';
import { SignInDto } from '@modules/user/dtos/sign-in.dto';
import { CreateUserDto } from '@modules/user/dtos/create-user.dto';
import { TCurrentUser } from '@modules/user/typings/current-user.type';
import { SignInResponseDto } from '@modules/auth/dtos/signIn-response.dto';
import { ForgotPasswordDto } from '@modules/auth/dtos/forgot-password.dto';
import { ResetPasswordBodyDto } from '@modules/auth/dtos/reset-password.dto';
import { ForgotPasswordResponseDto } from '@modules/auth/dtos/forgot-password-response.dto';

export class AuthServiceMock {
  users: User[] = [];

  validateUser(singInDto: SignInDto) {
    const { email, password } = singInDto;
    const user = this.users.find((user) => user.email === email);
    if (!user) return null;

    if (user.password !== password) return null;

    return user;
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const user = new User({ id: 1, ...createUserDto, role: 'user' });
    this.users.push(user);
    return user;
  }

  async signIn(currentUserDto: TCurrentUser): Promise<SignInResponseDto> {
    return {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY4NTAwNjM4NiwiZXhwIjoxNjg1NjExMTg2LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwic3ViIjoiMyJ9.47ukDZtOju2rrsOyj5HPbJxP8p6PRFyxjA8XYE-jeK8',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY4NTAwNjM4NiwiZXhwIjoxNjg1NjExMTg2LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwic3ViIjoiMyJ9.47ukDZtOju2rrsOyj5HPbJxP8p6PRFyxjA8XYE-jeK8',
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    return {
      passwordResetLink:
        'http://localhost:3000/api/auth/reset-password/1/eyosdfksdfkd',
    };
  }

  async resetPassword(
    resetPasswordParamsDto: { id: number; token: string },
    resetPasswordBodyDto: ResetPasswordBodyDto,
  ): Promise<void> {
    return;
  }

  async changePassword(): Promise<{ message: string }> {
    return { message: 'Password changed successfully!' };
  }

  async getAccessTokenUsingRefreshToken(
    refreshToken: string,
  ): Promise<SignInResponseDto> {
    return {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY4NTAwNjM4NiwiZXhwIjoxNjg1NjExMTg2LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwic3ViIjoiMyJ9.47ukDZtOju2rrsOyj5HPbJxP8p6PRFyxjA8XYE-jeK8',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY4NTAwNjM4NiwiZXhwIjoxNjg1NjExMTg2LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwic3ViIjoiMyJ9.47ukDZtOju2rrsOyj5HPbJxP8p6PRFyxjA8XYE-jeK8',
    };
  }

  async logoutUser(user: TCurrentUser): Promise<number> {
    return 1;
  }
}
