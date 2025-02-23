import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class ActivityLogQueryDto extends PartialType(CreateActivityDto) {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  skip?: number;
}
