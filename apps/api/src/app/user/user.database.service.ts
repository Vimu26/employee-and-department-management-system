import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import {
  IUser,
  IUserOptional,
} from '@employee-and-department-management-system/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CommonDatabaseService } from '../common/services/common.database.service';
import { UserModel } from './user.model';
import { ActivityDatabaseService } from '../activity/activity.database.service';

@Injectable()
export class UserDatabaseService extends CommonDatabaseService<IUser> {
  constructor(
    @InjectModel(DB_COLLECTION_NAMES.USERS) private userModel: Model<UserModel>,
    activityLogsDatabaseService: ActivityDatabaseService
  ) {
    super(activityLogsDatabaseService, userModel, DB_COLLECTION_NAMES.USERS);
  }

  async findOneUser(user: IUserOptional) {
    const filters: FilterQuery<IUserOptional> = {};

    if (user?.username) {
      filters.username = user.username;
    }
    if (user?.email) {
      filters.email = user.email;
    }

    return await this.userModel.findOne(filters);
  }
}
