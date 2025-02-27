import { Injectable } from '@nestjs/common';
import {
  IDepartment,
  IDepartmentsKeyValues,
} from '@employee-and-department-management-system/interfaces';
import { DepartmentModel } from './department.model';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonDatabaseService } from '../common/services/common.database.service';
import { ActivityDatabaseService } from '../activity/activity.database.service';

@Injectable()
export class DepartmentDatabaseService extends CommonDatabaseService<IDepartment> {
  constructor(
    @InjectModel(DB_COLLECTION_NAMES.DEPARTMENTS)
    private departmentModel: Model<DepartmentModel>,
    activityLogsDatabaseService: ActivityDatabaseService
  ) {
    super(
      activityLogsDatabaseService,
      departmentModel,
      DB_COLLECTION_NAMES.DEPARTMENTS
    );
  }

  async getDepartmentList(): Promise<IDepartmentsKeyValues[]> {
    return await this.departmentModel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ]);
  }
}
