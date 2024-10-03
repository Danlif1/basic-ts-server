import {Document} from 'mongoose';
import {User} from '../models/user';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import {join} from "path";
import {hashPassword} from "../middleware/encrypt";

dotenv.config({path: join(__dirname, '..', '.env')});

interface IUser extends Document {
  Username: string;
  DisplayName: string;
  Password: string;
  ProfilePicture: string;
}

async function getUserByUsername(username: string, hUsername: string): Promise<IUser | null> {
  if (hUsername && (username !== hUsername)) {
    return null;
  }
  const user = await User.findOne({Username: username}).exec();
  if (user) {
    return user as IUser;
  }

  return null;
}

async function registerUser(username: string | null, displayName: string | null,
                            password: string | null, profilePicture: string | null): Promise<boolean | null> {
  if (!username || !displayName || !password) {
    return null;
  }
  if (!profilePicture) {
    profilePicture = "default";
  }
  const userByName = await User.findOne({Username: username});
  if (userByName) {
    return null;
  }
  const registerDate = Date.now();
  const newUser = await new User({
    Username: username,
    Password: password,
    DisplayName: displayName,
    ProfilePicture: profilePicture,
    RegisterDate: registerDate
  });
  await newUser.save();
  return true;
}

async function generateToken(username: string, password: string): Promise<string> {
  const payload = {
    username,
    password
  };
  const key = process.env.SECRET_AUTH_KEY || 'default-auth-secret';

  return jwt.sign(payload, key, {expiresIn: '1h'});
}

module.exports = {
  getUserByUsername,
  registerUser,
  generateToken
};