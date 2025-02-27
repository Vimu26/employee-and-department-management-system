import {
  EMPLOYEE_STATUS,
  JOB_POSITION,
} from '@employee-and-department-management-system/enums';
import {
  IAddress,
  IEmployee,
  IName,
} from '@employee-and-department-management-system/interfaces';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateEmployeeDto implements IEmployee {
  @ValidateNested()
  @Type(() => Object)
  name: IName;

  @ValidateNested()
  @Type(() => Object)
  address: IAddress;

  @IsOptional()
  @IsString()
  epf_no: string;

  @IsOptional()
  @IsString()
  employee_id: string; //This must generate according to count of the employees

  @IsNotEmpty()
  @IsString()
  nic: string;

  @IsOptional()
  @IsEnum(EMPLOYEE_STATUS)
  status: EMPLOYEE_STATUS;

  @IsOptional()
  @IsString()
  profile_pic: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform((email) => email.value?.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsEnum(JOB_POSITION)
  @IsNotEmpty()
  position: JOB_POSITION;

  @IsNotEmpty()
  @IsString()
  department_id: string;
}
