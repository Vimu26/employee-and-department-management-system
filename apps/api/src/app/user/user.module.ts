import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserDatabaseService } from './user.database.service';
import { MongooseModule } from '@nestjs/mongoose';
import {  UserSchema } from './user.model';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_COLLECTION_NAMES.USERS, schema: UserSchema }, 
    ]),
  ],
  controllers: [UserController],
  providers: [UserDatabaseService],
})
export class UserModule {}
