import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import {
  CommonResponse,
  IActivityLog,
} from '@employee-and-department-management-system/interfaces';
import { ActivityDatabaseService } from './activity.database.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityLogQueryDto } from './dto/activity.query.dto';
import { FilterQuery } from 'mongoose';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(
    private readonly activityLogDatabaseService: ActivityDatabaseService
  ) {}

  @Post()
  async createActivityLog(
    @Body() activityLogData: CreateActivityDto
  ): Promise<IActivityLog> {
    return this.activityLogDatabaseService.createLog(activityLogData);
  }

  @Get()
  async findActivityLogs(
    @Query() query: ActivityLogQueryDto
  ): Promise<CommonResponse<IActivityLog[]>> {
    const filters: FilterQuery<ActivityLogQueryDto> = {};
    if (query.parent_id) {
      filters.parent_id = query.parent_id;
    }

    if (query.action) {
      filters.action = query.action;
    }

    const options = {
      limit: query.size ?? 10,
      skip: query.start ?? 0,
    };

    return await this.activityLogDatabaseService.getActivityLogWithUserData(
      filters,
      options.limit,
      options.skip
    );
  }

  @Get(':id')
  async getActivityLog(@Param() id: string): Promise<IActivityLog | null> {
    const activityLog = await this.activityLogDatabaseService.findById(id);

    if (!activityLog) throw new NotFoundException('ActivityLog not found');

    return activityLog;
  }

  @Delete(':id')
  async deleteActivityLog(@Param() id: string): Promise<void> {
    const result = await this.activityLogDatabaseService.deleteActivityLog(id);
    if (!result) {
      throw new NotFoundException('ActivityLog not found');
    }
  }

  @Get('count')
  async getActivityLogsCount(
    @Query() query: ActivityLogQueryDto
  ): Promise<{ count: number }> {
    const count = await this.activityLogDatabaseService.getEntriesCount();
    return { count };
  }
}
