import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  BaseNameSchemaContent,
  BaseAddressSchemaContent,
} from '../common/models/common.model';
import {
  IAddress,
  IName,
  IUser,
} from '@employee-and-department-management-system/interfaces';
import { USER_ROLES } from '@employee-and-department-management-system/enums';

export type UserModel = IUser & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ type: BaseNameSchemaContent, required: true })
  name: IName;

  @Prop({ type: BaseAddressSchemaContent, required: true })
  address: IAddress;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profile_pic: string; //file name of profile picture

  @Prop({ enum: USER_ROLES, required: true, type: String })
  role: USER_ROLES;

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

export const UserSchema = SchemaFactory.createForClass(User);
