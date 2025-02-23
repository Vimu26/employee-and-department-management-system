import { Module } from '@nestjs/common';
import { DepartmentService } from './department.database.service';
import { DepartmentController } from './department.controller';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
