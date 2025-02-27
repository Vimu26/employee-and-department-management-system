import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class ActivityLogQueryDto extends PartialType(CreateActivityDto) {
  _id?: string;
  size?: number;
  start?: number;
}
