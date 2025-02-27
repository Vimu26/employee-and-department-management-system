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

  async getActivityLogWithUserData(
    filters: any,
    limit: number,
    skip: number
  ): Promise<{ data: IActivityLog[]; count: number }> {
    const aggregation: PipelineStage[] = [
      {
        $match: {
          ...filters,
        },
      },
      {
        $addFields: {
          created_by: { $toObjectId: '$created_by' },
          parent_id: { $toObjectId: '$parent_id' },
          last_modified_by: { $toObjectId: '$last_modified_by' },
        },
      },
      {
        $lookup: {
          from: DB_COLLECTION_NAMES.USERS,
          localField: 'created_by',
          foreignField: '_id',
          as: 'createdByUser',
        },
      },
      {
        $unwind: { path: '$createdByUser', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: DB_COLLECTION_NAMES.EMPLOYEES,
          localField: 'parent_id',
          foreignField: '_id',
          as: 'parent',
        },
      },
      {
        $unwind: { path: '$parent', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: DB_COLLECTION_NAMES.USERS,
          localField: 'last_modified_by',
          foreignField: '_id',
          as: 'lastModifiedByUser',
        },
      },
      {
        $unwind: {
          path: '$lastModifiedByUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          count: [
            {
              $count: 'totalCount',
            },
          ],
        },
      },
      {
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$count.totalCount', 0] }, // Access the total count
        },
      },
    ];

    const result = await this.activityLogsModel.aggregate(aggregation);

    return {
      data: result[0].data, // The activity log data
      count: result[0].count || 0, // The total count of activity logs
    };
  }
}
