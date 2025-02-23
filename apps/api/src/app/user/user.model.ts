import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 
import {
  BaseNameSchemaContent,
  BaseAddressSchemaContent,
  BaseEntitySchemaContent,
} from '../common/models/common.model';
import { IAddress, IBaseEntity, IName, IUser } from '@employee-and-department-management-system/interfaces';
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

  @Prop({ enum: USER_ROLES, required: true, type: String })
  role: USER_ROLES;

  @Prop({ type: BaseEntitySchemaContent })
  baseEntity: IBaseEntity;
}

export const UserSchema = SchemaFactory.createForClass(User);
