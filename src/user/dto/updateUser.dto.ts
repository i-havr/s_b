import { UserRoleType } from '@app/types';

export class UpdateUserDto {
  readonly username: string;
  readonly bio: string;
  readonly image: string;
  readonly role: UserRoleType[];
  readonly kindergarten: number;
  readonly group: string[];
  readonly password: string;
}
