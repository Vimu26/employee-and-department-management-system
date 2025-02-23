import { IsString, IsEmail, IsNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { USER_ROLES } from '@employee-and-department-management-system/enums';
import { IName, IAddress } from '@employee-and-department-management-system/interfaces';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(USER_ROLES)
  role: USER_ROLES;

  @ValidateNested()
  @Type(() => Object)
  name: IName;

  @ValidateNested()
  @Type(() => Object)
  address: IAddress;
}
