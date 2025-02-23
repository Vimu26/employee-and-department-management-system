import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IDepartment } from '@employee-and-department-management-system/interfaces';
import { DEPARTMENT_TYPE } from '@employee-and-department-management-system/enums';

export type DepartmentModel = IDepartment & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ enum: DEPARTMENT_TYPE, required: true, type: String })
  type: DEPARTMENT_TYPE;

  @Prop({ required: true })
  created_by: string;

  @Prop({ required: true })
  last_modified_by: string;

  @Prop({ default: Date.now })
  created_on: Date;

  @Prop({ default: Date.now })
  last_modified_on: Date;
}

export const DepartmentModel = SchemaFactory.createForClass(Department);
