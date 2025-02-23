import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthDatabaseService } from './services/auth.database.service';

@Module({
  controllers: [AuthController],
  providers: [AuthDatabaseService],
})
export class AuthModule {}
