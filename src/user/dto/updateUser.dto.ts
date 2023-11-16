import { UserRoleType } from '@app/types';

import { KindergartenEntity } from '@app/kindergarten/kindergarten.entity';

export class UpdateUserDto {
  readonly name?: string;
  readonly additionalInfo?: string;
  readonly image?: string;
  readonly role?: UserRoleType[];
  readonly kindergarten?: KindergartenEntity;
  readonly group?: string[];
  readonly password?: string;
}
