// src/auth/dto/create-user.dto.ts

import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { USER_ROLES } from '@employee-and-department-management-system/enums';
import {
  IName,
  IAddress,
  IUser,
} from '@employee-and-department-management-system/interfaces';

export class RegisterUserDto implements IUser {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform((email) => email.value?.toLowerCase())
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
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
