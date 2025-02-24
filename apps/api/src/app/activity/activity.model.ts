import { ACTIVITY_ACTIONS } from '@employee-and-department-management-system/enums';
import { IActivityLog } from '@employee-and-department-management-system/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityLogDocument = IActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ type: Types.ObjectId, ref: 'employee', required: true })
  employee_id: Types.ObjectId;

  @Prop({ required: true, enum: ACTIVITY_ACTIONS, type: String })
  action: ACTIVITY_ACTIONS;

  @Prop({ required: true })
  created_by: string;

  @Prop({ required: true })
  last_modified_by: string;

  @Prop({ default: Date.now })
  created_on: Date;

  @Prop({ default: Date.now })
  last_modified_on: Date;
}

export const ActivityLogModel = SchemaFactory.createForClass(ActivityLog);
