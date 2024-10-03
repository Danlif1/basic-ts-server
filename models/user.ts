import mongoose, {Document, Schema} from 'mongoose';

interface IUser extends Document {
  Username: string;
  DisplayName: string;
  Password: string;
  ProfilePicture?: string;
  RegisterDate: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  Username: {
    type: String,
    required: true,
    unique: true
  },
  DisplayName: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true
  },
  ProfilePicture: {
    type: String,
    default: null
  },
  RegisterDate: {
    type: Date,
    required: true
  }
});

const User = mongoose.model<IUser>('User', UserSchema);

export {User};
