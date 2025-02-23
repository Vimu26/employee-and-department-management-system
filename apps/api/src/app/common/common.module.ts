import { Module } from '@nestjs/common';
import { CommonDatabaseService } from './services/common.database.service';
import { CommonController } from './controllers/common.controller';

@Module({
  controllers: [CommonController],
  providers: [CommonDatabaseService],
})
export class CommonModule {}
