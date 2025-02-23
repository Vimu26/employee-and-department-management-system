import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  BaseNameSchemaContent,
  BaseAddressSchemaContent,
  BaseEntitySchemaContent,
} from '../common/models/common.model';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ type: BaseNameSchemaContent, required: true })
  name: Record<string, string>;

  @Prop({ type: BaseAddressSchemaContent, required: true })
  address: Record<string, string>;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  jobTitle: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Department' })
  departmentId: string;

  @Prop({ enum: ['Active', 'Inactive'], default: 'Active' })
  status: string;

  @Prop()
  profilePicture?: string;

  @Prop({ type: BaseEntitySchemaContent })
  baseEntity: Record<string, any>;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
