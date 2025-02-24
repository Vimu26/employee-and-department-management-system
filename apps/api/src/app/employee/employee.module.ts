import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { EmployeeModel } from './employee.model';
import { EmployeeDatabaseService } from './employee.database.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_COLLECTION_NAMES.EMPLOYEES, schema: EmployeeModel },
    ]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeDatabaseService],
})
export class EmployeeModule {}
