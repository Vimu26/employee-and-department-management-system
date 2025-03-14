import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  BaseNameSchemaContent,
  BaseAddressSchemaContent,
} from '../common/models/common.model';
import {
  IAddress,
  IName,
  IEmployee,
} from '@employee-and-department-management-system/interfaces';
import {
  EMPLOYEE_STATUS,
  JOB_POSITION,
} from '@employee-and-department-management-system/enums';

export type EmployeeModel = IEmployee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ type: BaseNameSchemaContent, required: true })
  name: IName;

  @Prop({ type: BaseAddressSchemaContent, required: true })
  address: IAddress;

  @Prop()
  epf_no: string;

  @Prop({ required: true, unique: true })
  nic: string;

  @Prop({ unique: true })
  employee_id: string;

  @Prop({ enum: EMPLOYEE_STATUS, type: String })
  status: EMPLOYEE_STATUS;

  @Prop({ unique: false })
  profile_pic: string; //url of the image

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ enum: JOB_POSITION, required: true, type: String })
  position: JOB_POSITION;

  @Prop({ type: String, ref: 'Department', required: true })
  department_id: string;

  // Explicit Base Entity Fields
  @Prop()
  created_by: string;

  @Prop()
  last_modified_by: string;

  @Prop({ default: Date.now })
  created_on: Date;

  @Prop({ default: Date.now })
  last_modified_on: Date;
}

export const EmployeeModel = SchemaFactory.createForClass(Employee);
