import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class File extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalname: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  mimetype: string;
}

export const FileModel = SchemaFactory.createForClass(File);
