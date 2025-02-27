import { Injectable } from '@nestjs/common';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { IEmployee } from '@employee-and-department-management-system/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonDatabaseService } from '../common/services/common.database.service';
import { EmployeeModel } from './employee.model';
import { ActivityDatabaseService } from '../activity/activity.database.service';

@Injectable()
export class EmployeeDatabaseService extends CommonDatabaseService<IEmployee> {
  constructor(
    @InjectModel(DB_COLLECTION_NAMES.EMPLOYEES)
    private employeeModel: Model<EmployeeModel>,
    activityLogsDatabaseService: ActivityDatabaseService
  ) {
    super(
      activityLogsDatabaseService,
      employeeModel,
      DB_COLLECTION_NAMES.EMPLOYEES
    );
  }

  async generateEmployeeId(): Promise<{ employee_id: string }> {
    const employeeCount = await this.employeeModel.countDocuments();
    const nextNumber = employeeCount + 1;
    const formattedNumber = String(nextNumber).padStart(4, '0'); 
    const employeeId = `EMP${formattedNumber}`;
    
    return { employee_id: employeeId };
  }
  
}
