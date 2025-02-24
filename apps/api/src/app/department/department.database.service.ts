import { Injectable } from '@nestjs/common';
import { IDepartment } from '@employee-and-department-management-system/interfaces';
import { DepartmentModel } from './department.model';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonDatabaseService } from '../common/services/common.database.service';

@Injectable()
export class DepartmentDatabaseService extends CommonDatabaseService<IDepartment> {
  constructor(
    @InjectModel(DB_COLLECTION_NAMES.DEPARTMENTS)
    private employeeModel: Model<DepartmentModel>
  ) {
    super(employeeModel, DB_COLLECTION_NAMES.DEPARTMENTS);
  }
}
