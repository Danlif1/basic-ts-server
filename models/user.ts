import mongoose, {Schema, model, InferSchemaType} from 'mongoose';

/**
 * User schema for mongoDB.
 */
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  registerDate: {
    type: Date,
    required: true
  }
});

/**
 * An interface for typescript of the mongoDB schema.
 */
type IUser = InferSchemaType<typeof userSchema>;

// Create the Mongoose model
const User = model<IUser>('User', userSchema);

export {User, IUser};
