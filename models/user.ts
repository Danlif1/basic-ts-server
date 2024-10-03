import mongoose, {Schema, model, InferSchemaType} from 'mongoose';

// Define the schema
const UserSchema = new Schema({
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

// Infer the schema type from the UserSchema
type IUser = InferSchemaType<typeof UserSchema>;

// Create the Mongoose model
const User = model<IUser>('User', UserSchema);

export {User, IUser};
