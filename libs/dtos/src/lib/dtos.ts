import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import {
  IBaseEntity,
  IName,
  IAddress,
} from '@employee-and-department-management-system/interfaces';
import { Transform } from 'class-transformer';

// Base DTO
export class BaseEntityDto implements IBaseEntity {
  @IsOptional()
  _id?: string;

  @IsOptional()
  created_on?: Date;

  @IsOptional()
  last_modified_on?: Date;

  @IsString()
  @IsOptional()
  created_by?: string;

  @IsString()
  @IsOptional()
  last_modified_by?: string;
}

// Name DTO
export class NameDto implements IName {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;
}

// Address DTO
export class AddressDto implements IAddress {
  @IsString()
  @IsNotEmpty()
  no: string;

  @IsString()
  @IsNotEmpty()
  street1: string;

  @IsString()
  @IsOptional()
  street2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
