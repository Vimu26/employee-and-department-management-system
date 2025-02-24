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
import { IActivityLog } from '@employee-and-department-management-system/interfaces';
import { ActivityDatabaseService } from './activity.database.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityLogQueryDto } from './dto/activity.query.dto';

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
  ): Promise<IActivityLog[]> {
    const filters = {
      patent_id: query.parent_id,
      action: query.action,
    };

    const options = {
      limit: query.limit ?? 10,
      skip: query.skip ?? 0,
    };

    return this.activityLogDatabaseService.filterLogs(
      filters,
      options.limit,
      options.skip
    );
  }

  @Get(':id')
  async getActivityLog(@Param('id') id: string): Promise<IActivityLog | null> {
    const activityLog = await this.activityLogDatabaseService.findById(id);

    if (!activityLog) throw new NotFoundException('ActivityLog not found');

    return activityLog;
  }

  @Delete(':id')
  async deleteActivityLog(@Param('id') id: string): Promise<void> {
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
