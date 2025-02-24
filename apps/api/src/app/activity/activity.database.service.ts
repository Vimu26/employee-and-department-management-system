import { Injectable } from '@nestjs/common';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, PipelineStage } from 'mongoose';
import {
  IActivityLog,
  IOptionalActivityLogs,
} from '@employee-and-department-management-system/interfaces';

@Injectable()
export class ActivityDatabaseService {
  constructor(
    @InjectModel(DB_COLLECTION_NAMES.ACTIVITY_LOGS)
    private activityLogsModel: Model<IActivityLog>
  ) {}

  createLog(log: IActivityLog): Promise<IActivityLog> {
    return this.activityLogsModel.create(log);
  }

  async getEntriesCount(): Promise<number> {
    const aggregationResult = await this.activityLogsModel
      .aggregate([
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    if (aggregationResult.length > 0) {
      return aggregationResult[0].count;
    } else {
      return 0;
    }
  }

  async findById(id: string): Promise<IActivityLog | null> {
    return this.activityLogsModel.findById(id).exec();
  }

  async deleteActivityLog(id: string): Promise<boolean> {
    const result = await this.activityLogsModel.findByIdAndDelete(id).exec();
    return result ? true : false;
  }

  async filterLogs(
    generalFilters: FilterQuery<IOptionalActivityLogs>,
    limit?: number,
    skip?: number
  ): Promise<IActivityLog[]> {
    const pagination: PipelineStage[] =
      limit > 0 && skip >= 0 ? [{ $skip: skip }, { $limit: limit }] : [];

    const aggregationParams: PipelineStage[] = [
      {
        $match: generalFilters,
      },
      {
        $sort: {
          date: -1,
        },
      },
      ...pagination,
    ];

    const results = await this.activityLogsModel
      .aggregate<IActivityLog>(aggregationParams)
      .allowDiskUse(true)
      .exec();

    return results;
  }
}
