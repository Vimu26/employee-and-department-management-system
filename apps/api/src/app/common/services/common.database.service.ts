import {
  Document,
  FilterQuery,
  Model,
  PopulateOptions,
  QueryOptions,
  Types,
} from 'mongoose';
import { IBaseEntity } from '@employee-and-department-management-system/interfaces';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';

export abstract class CommonDatabaseService<T extends IBaseEntity> {
  constructor(
    protected mongooseModel: Model<T & Document>,
    protected model: DB_COLLECTION_NAMES
  ) {}

  async addNewDocument(
    doc: T,
    populate: string | PopulateOptions | (string | PopulateOptions)[] = []
  ): Promise<T> {
    const newDoc = await this.mongooseModel.create({ ...doc });
    await newDoc.populate(populate);
    return newDoc.toObject() as T;
  }

  async updateDocument(
    doc: T,
    populate: string | PopulateOptions | (string | PopulateOptions)[] = [],
    filter: FilterQuery<T> = { _id: doc._id }
  ): Promise<T> {
    const newDocOnDb = await this.mongooseModel
      .findOneAndUpdate(
        filter,
        { ...doc, last_modified_on: new Date() },
        { new: true }
      )
      .exec();

    return newDocOnDb ? (await newDocOnDb.populate(populate)).toObject() : null;
  }

  async filterDocuments(
    filter: FilterQuery<T> = {},
    options: QueryOptions<T> = {}
  ): Promise<T[]> {

    const { limit = 10, skip = 0 } = options;
  
    return this.mongooseModel
    .find(filter, {}, { lean: true, ...options })
    .sort({ created_on: 'desc' }) 
    .skip(skip)  
    .limit(limit) 
    .exec();
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

  async hardDelete(id: Types.ObjectId | string): Promise<T | null> {
    const doc = (
      await this.mongooseModel.findByIdAndDelete(id)?.exec()
    )?.toObject();
    return doc as T | null;
  }

  async getEntriesCount(): Promise<number> {
    const aggregationResult = await this.mongooseModel
      .aggregate([{ $group: { _id: null, count: { $sum: 1 } } }])
      .exec();
    return aggregationResult.length > 0 ? aggregationResult[0].count : 0;
  }
}
