import { UserRoleType } from '@app/types';

export class UpdateUserDto {
  readonly name: string;
  readonly additionalInfo: string;
  readonly image: string;
  readonly role: UserRoleType[];
  readonly kindergarten: number;
  readonly group: string[];
  readonly password: string;
}
