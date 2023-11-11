import { UserEntity } from '@app/user/user.entity';

export type UserUpdateRequestType = Omit<
  UserEntity,
  'id' | 'email' | 'hashPassword'
>;
