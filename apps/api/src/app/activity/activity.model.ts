import {
  ACTIVITY_ACTIONS,
  DB_COLLECTION_NAMES,
} from '@employee-and-department-management-system/enums';
import { IActivityLog } from '@employee-and-department-management-system/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityLogDocument = IActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ type: Types.ObjectId, ref: 'employee', required: true })
  parent_id: Types.ObjectId;

  @Prop({ required: true, enum: ACTIVITY_ACTIONS, type: String })
  action: ACTIVITY_ACTIONS;

  @Prop({ required: true, enum: DB_COLLECTION_NAMES, type: String })
  model: DB_COLLECTION_NAMES;

  @Prop()
  created_by: string;

  @Prop()
  last_modified_by: string;

  @Prop({ default: Date.now })
  created_on: Date;

  @Prop({ default: Date.now })
  last_modified_on: Date;
}

export const ActivityLogModel = SchemaFactory.createForClass(ActivityLog);
