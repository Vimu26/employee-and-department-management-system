import {
  DEPARTMENT_TYPE,
  JOB_POSITION,
} from '@employee-and-department-management-system/enums';
import { IDepartment } from '@employee-and-department-management-system/interfaces';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto implements IDepartment {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DEPARTMENT_TYPE)
  @IsNotEmpty()
  type: DEPARTMENT_TYPE;

  @IsString()
  description?: string;
}
