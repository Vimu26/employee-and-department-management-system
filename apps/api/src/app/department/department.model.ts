import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntitySchemaContent } from '../common/models/common.model';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: BaseEntitySchemaContent })
  baseEntity: Record<string, any>;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
