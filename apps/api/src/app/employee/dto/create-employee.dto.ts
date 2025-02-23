import { JOB_POSITION } from "@employee-and-department-management-system/enums";
import { IAddress, IEmployee, IName } from "@employee-and-department-management-system/interfaces";
import { Transform, Type } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CreateEmployeeDto implements IEmployee {
  @ValidateNested()
  @Type(() => Object)
  name: IName;

  @ValidateNested()
  @Type(() => Object)
  address: IAddress;

  @IsNotEmpty()
  @IsString()
  epf_no: string;

  @IsNotEmpty()
  @IsString()
  employee_id: string; //This must generate according to count of the employees

  @IsEmail()
  @IsNotEmpty()
   @Transform((email) => email.value?.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsEnum(JOB_POSITION)
  position: JOB_POSITION;

  @IsNotEmpty()
  @IsString()
  department_id: string;
}
