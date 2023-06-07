import { User } from '@modules/user/user.entity';

export type TCurrentUser = Pick<
  User,
  'email' | 'id' | 'firstName' | 'lastName' | 'role'
>;
