import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ACTIVITY_ACTIONS } from '@employee-and-department-management-system/enums';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsEnum(ACTIVITY_ACTIONS)
  action: ACTIVITY_ACTIONS;
}
