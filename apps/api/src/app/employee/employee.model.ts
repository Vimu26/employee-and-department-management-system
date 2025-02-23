import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  BaseNameSchemaContent,
  BaseAddressSchemaContent,
  BaseEntitySchemaContent,
} from '../common/models/common.model';
import {
  IAddress,
  IBaseEntity,
  IName,
  IEmployee,
} from '@employee-and-department-management-system/interfaces';
import { JOB_POSITION } from '@employee-and-department-management-system/enums';

export type EmployeeModel = IEmployee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ type: BaseNameSchemaContent, required: true })
  name: IName;

  @Prop({ type: BaseAddressSchemaContent, required: true })
  address: IAddress;

  @Prop({ required: true, unique: true })
  epf_no: string;

  @Prop({ required: true, unique: true })
  employee_id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ enum: JOB_POSITION, required: true, type: String })
  position: JOB_POSITION;

  @Prop({ type: String, ref: 'Department', required: true })
  department_id: string;

  // Explicit Base Entity Fields
  @Prop({ required: true })
  created_by: string;

  @Prop({ required: true })
  last_modified_by: string;

  @Prop({ default: Date.now })
  created_on: Date;

  @Prop({ default: Date.now })
  last_modified_on: Date;
}

export const EmployeeModel = SchemaFactory.createForClass(Employee);
