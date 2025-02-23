import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { IUser } from '@employee-and-department-management-system/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonDatabaseService } from '../common/services/common.database.service';
import { UserModel } from './user.model';

@Injectable()
export class UserDatabaseService extends CommonDatabaseService<IUser> {
  constructor(
    @InjectModel(DB_COLLECTION_NAMES.USERS) private userModel: Model<UserModel>
  ) {
    super(userModel, DB_COLLECTION_NAMES.USERS);
  }
}
