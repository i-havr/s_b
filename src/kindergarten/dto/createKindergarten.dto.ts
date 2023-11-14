import { IsNotEmpty } from 'class-validator';

export class CreateKindergartenDto {
  @IsNotEmpty()
  readonly name: string;
}
