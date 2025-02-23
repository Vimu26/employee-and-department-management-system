import { Module } from '@nestjs/common';
import { ActivityService } from './activity.database.service';
import { ActivityController } from './activity.controller';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
