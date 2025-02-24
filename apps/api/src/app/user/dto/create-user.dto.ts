import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { USER_ROLES } from '@employee-and-department-management-system/enums';
import {
  IName,
  IAddress,
  IUser,
} from '@employee-and-department-management-system/interfaces';

export class CreateUserDto implements IUser {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform((email) => email.value?.toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(USER_ROLES)
  @IsNotEmpty()
  role: USER_ROLES;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Object)
  name: IName;

  @ValidateNested()
  @Type(() => Object)
  address: IAddress;

  @IsString()
  @IsOptional()
  profile_pic: string;
}
