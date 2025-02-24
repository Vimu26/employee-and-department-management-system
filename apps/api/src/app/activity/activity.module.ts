import { Module } from '@nestjs/common';
import { ActivityDatabaseService } from './activity.database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { ActivityLogModel } from './activity.model';
import { ActivityLogController } from './activity.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_COLLECTION_NAMES.ACTIVITY_LOGS, schema: ActivityLogModel },
    ]),
  ],
  controllers: [ActivityLogController],
  providers: [ActivityDatabaseService],
})
export class ActivityModule {}
