import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';

export class EmployeeQueryDto extends PartialType(CreateEmployeeDto) {
  _id?: string;
  f_name: string;
  start?: number;
  size?: number;
}
