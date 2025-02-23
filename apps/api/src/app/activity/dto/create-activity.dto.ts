import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ACTIVITY_ACTIONS } from '@employee-and-department-management-system/enums';
import { IActivityLog } from '@employee-and-department-management-system/interfaces';

export class CreateActivityDto implements IActivityLog {
  @IsString()
  @IsNotEmpty()
  employee_id: string;

  @IsEnum(ACTIVITY_ACTIONS)
  action: ACTIVITY_ACTIONS;
}
