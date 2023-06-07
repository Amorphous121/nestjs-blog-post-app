import { SignInDto } from '@modules/user/dtos/sign-in.dto';
import { UpdateUserDto } from '@modules/user/dtos/update-user.dto';
import { CreateUserDto } from '@modules/user/dtos/create-user.dto';
import { TCurrentUser } from '@modules/user/typings/current-user.type';
import { ChangePasswordDto } from '@modules/auth/dtos/change-password.dto';
import { ResetPasswordBodyDto } from '@modules/auth/dtos/reset-password.dto';

export const CreateUserDtoStub = (
  createUserDto: CreateUserDto | Record<string, any> = {},
): CreateUserDto => {
  return {
    firstName: 'Prathamesh',
    lastName: 'Patil',
    age: 24,
    email: 'pratham@gmail.com',
    password: '1234',
    ...createUserDto,
  };
};

export const SignInDtoStub = (
  singInDto: SignInDto | Record<string, any> = {},
): SignInDto => {
  return {
    email: 'pratham@gmail.com',
    password: '1234',
    ...singInDto,
  };
};

export const UpdateUserDtoStub = (
  updateUserDto: UpdateUserDto | Record<string, any> = {},
): UpdateUserDto => {
  return {
    firstName: 'Prathamesh',
    lastName: 'Patil',
    age: 25,
    email: 'prathamesh@gmail.com',
    ...updateUserDto,
  };
};

export const CurrentUserDtoStub = (
  currentUserStub: Record<string, any> | TCurrentUser = {},
): TCurrentUser => {
  return {
    id: 1,
    firstName: 'Prathamesh',
    lastName: 'Patil',
    role: 'user',
    email: 'pratham@gmail.com',
    ...currentUserStub,
  };
};

export const ResetPasswordBodyDtoStub = (
  resetPasswordBodyDto: ResetPasswordBodyDto | Record<string, any> = {},
): ResetPasswordBodyDto => {
  return {
    password: '1234',
    confirmPassword: '1234',
    ...resetPasswordBodyDto,
  };
};

export const ResetPasswordParamsDtoStub = (
  resetPasswordParamsDto:
    | { id: number; token: string }
    | Record<string, any> = {},
) => {
  return {
    id: 1,
    token: 'string',
    ...resetPasswordParamsDto,
  };
};

export const ChangePasswordDtoStub = (
  changePasswordDto: ChangePasswordDto | Record<string, any> = {},
): ChangePasswordDto => {
  return {
    oldPassword: '',
    newPassword: 'parth123',
    confirmPassword: 'parth123',
    ...changePasswordDto,
  };
};
