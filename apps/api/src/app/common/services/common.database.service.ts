import {
  Document,
  FilterQuery,
  Model,
  PopulateOptions,
  QueryOptions,
  Types,
} from 'mongoose';
import {
  IActivityLog,
  IBaseEntity,
} from '@employee-and-department-management-system/interfaces';
import {
  ACTIVITY_ACTIONS,
  DB_COLLECTION_NAMES,
} from '@employee-and-department-management-system/enums';
import { ActivityDatabaseService } from '../../activity/activity.database.service';

export abstract class CommonDatabaseService<T extends IBaseEntity> {
  constructor(
    public logsDatabaseService: ActivityDatabaseService,
    protected mongooseModel: Model<T & Document>,
    protected model: DB_COLLECTION_NAMES
  ) {}

  async addNewDocument(
    doc: T,
    logParams: Partial<IActivityLog>,
    populate: string | PopulateOptions | (string | PopulateOptions)[] = []
  ): Promise<T> {
    const newDoc = await this.mongooseModel.create({ ...doc });
    await newDoc.populate(populate);
    const createdDoc = newDoc.toObject() as T;

    const newLog: IActivityLog = {
      action: ACTIVITY_ACTIONS.CREATED,
      created_by: logParams.created_by,
      created_on: new Date(),
      model: this.model,
      parent_id: createdDoc._id,
    };

    await this.logsDatabaseService.createLog(newLog);

    return createdDoc;
  }

  async updateDocument(
    doc: T,
    logParams: Partial<IActivityLog>,
    populate: string | PopulateOptions | (string | PopulateOptions)[] = [],
    filter: FilterQuery<T> = { _id: doc._id }
  ): Promise<T | null> {
    if (!doc || !('_id' in doc)) {
      throw new Error('Document must have an _id for updating');
    }

    const newDoc: T = {
      ...doc,
      last_modified_on: new Date(),
      last_modified_by:
        logParams?.last_modified_by ??
        ('last_modified_by' in doc ? doc.last_modified_by : null),
    };

    const oldDocOnDb = await this.mongooseModel.findOne(filter).exec();

    const newDocOnDb = await this.mongooseModel
      .findOneAndUpdate(filter, newDoc, { new: true })
      .exec();

    if (!newDocOnDb) return null;

    if (oldDocOnDb) {
      const newLog: IActivityLog = {
        action: ACTIVITY_ACTIONS.UPDATED,
        created_by: logParams.created_by,
        created_on: new Date(),
        model: this.model,
        parent_id: doc._id,
      };
      await this.logsDatabaseService.createLog(newLog);
    }

    return (await newDocOnDb.populate(populate)).toObject();
  }

  async filterDocuments(
    filter: FilterQuery<T> = {},
    options: QueryOptions<T> = {}
  ): Promise<T[]> {

    return this.mongooseModel
      .find(filter, {}, { lean: true, ...options })
      .sort({ created_on: 'desc' })
      .exec();
  }

  async filterPaginatedDocumentsWithCount(
    filter: FilterQuery<T> = {},
    options: QueryOptions<T> = {}
  ): Promise<{ total: number; data: T[] }> {
    const { limit = 10, skip = 0 } = options;
  
    const total = await this.mongooseModel.countDocuments(filter).exec();
  
    const data = await this.mongooseModel
      .find(filter, {}, { lean: true, ...options })
      .sort({ created_on: 'desc' })
      .skip(skip)
      .limit(limit)
      .exec();
  
    return { total, data };
  }

  async findDocument(
    filter: FilterQuery<T> = {},
    options: QueryOptions<T> = {}
  ): Promise<T | null> {
    return (
      await this.mongooseModel.findOne(filter, {}, options)?.exec()
    )?.toObject() as T | null;
  }

  async findById(id: Types.ObjectId | string): Promise<T | null> {
    return (
      await this.mongooseModel.findById(id)?.exec()
    )?.toObject() as T | null;
  }

  async hardDelete(
    id: Types.ObjectId | string,
    logParams: Partial<IActivityLog>
  ): Promise<T | null> {
    const doc_id = new Types.ObjectId(id);
    const doc = (
      await this.mongooseModel.findByIdAndDelete(doc_id)?.exec()
    )?.toObject();

    if (!doc) return null;

    const newLog: IActivityLog = {
      action: ACTIVITY_ACTIONS.UPDATED,
      created_by: logParams.created_by,
      created_on: new Date(),
      model: this.model,
      parent_id: doc._id,
    };
    await this.logsDatabaseService.createLog(newLog);

    return doc as T;
  }

  async getEntriesCount(): Promise<number> {
    const aggregationResult = await this.mongooseModel
      .aggregate([{ $group: { _id: null, count: { $sum: 1 } } }])
      .exec();
    return aggregationResult.length > 0 ? aggregationResult[0].count : 0;
  }
}
