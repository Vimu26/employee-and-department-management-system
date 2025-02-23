import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose'; // Import MongooseSchema explicitly
import {
  BaseNameSchemaContent,
  BaseAddressSchemaContent,
  BaseEntitySchemaContent,
} from '../common/models/common.model';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ type: BaseNameSchemaContent, required: true })
  name: Record<string, string>;

  @Prop({ type: BaseAddressSchemaContent, required: true })
  address: Record<string, string>;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['Admin', 'HR Manager'], required: true })
  role: 'Admin' | 'HR Manager';

  @Prop({ type: BaseEntitySchemaContent })
  baseEntity: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
