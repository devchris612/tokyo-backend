import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { Song } from 'src/songs/schema/Song.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  hashedPassword: string;

  @Prop()
  name: string;

  @Prop()
  dob: string;

  @Prop()
  phone: string;

  @Prop()
  avatarUrl: string;

  @Prop({ type: Date, required: true, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  updatedAt: Date;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  })
  songs: Song[];
}

export const UserSchema = SchemaFactory.createForClass(User);
