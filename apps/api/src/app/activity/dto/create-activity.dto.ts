import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ACTIVITY_ACTIONS } from '@employee-and-department-management-system/enums';
import { IActivityLog } from '@employee-and-department-management-system/interfaces';

export class CreateActivityDto implements IActivityLog {
  @IsString()
  @IsOptional()
  parent_id?: string;

  @IsOptional()
  @IsEnum(ACTIVITY_ACTIONS)
  action?: ACTIVITY_ACTIONS;
}
