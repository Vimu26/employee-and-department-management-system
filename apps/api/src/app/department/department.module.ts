import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentModel,  } from './department.model';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { DepartmentDatabaseService } from './department.database.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_COLLECTION_NAMES.DEPARTMENTS, schema: DepartmentModel },
    ]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentDatabaseService],
})
export class DepartmentModule {}
