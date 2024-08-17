import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { User } from 'src/users/schema/User.schema';

export type SongDocument = HydratedDocument<Song>;

@Schema()
export class Song {
  @Prop({ unique: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  songUrl: string;

  @Prop()
  imageUrl: string;

  @Prop({ type: Date, required: true, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  updatedAt: Date;
}

export const SongSchema = SchemaFactory.createForClass(Song);
