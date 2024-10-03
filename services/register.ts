import {User, IUser} from '../models/user';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import {join} from "path";

dotenv.config({path: join(__dirname, '..', '.env')});

async function getUserByUsername(username: string, headerUsername: string): Promise<IUser | null> {
  if (headerUsername && (username !== headerUsername)) {
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