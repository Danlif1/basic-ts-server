import {User, IUser} from '../models/user';
import jwt from 'jsonwebtoken';

/**
 * This function gets a username we want to know about, and the person who created the request,
 * It returns the user data if the person who created the request has permissions to view the user
 * (For now: only if he is the user)
 * @param username The user we want to access
 * @param headerUsername Currently we support that only the user can access his data.
 */
async function getUserByUsername(username: string, headerUsername: string): Promise<IUser | null> {
  if (headerUsername && (username !== headerUsername)) {
    return null;
  }
  const user = await User.findOne({username: username});
  if (user) {
    return user as IUser;
  }

  return null;
}

/**
 * Registers the user with the following:
 * @param username The username for the database (Unique)
 * @param displayName The name people will see (Unique)
 * @param password The password to login (When saved it will be hashed).
 * @param profilePicture The profile picture of the user (Optional).
 */
async function registerUser(username: string | null, displayName: string | null,
                            password: string | null, profilePicture: string | null): Promise<boolean | null> {
  if (!username || !displayName || !password) {
    return null;
  }
  if (!profilePicture) {
    profilePicture = "default";
  }
  const userByName = await User.findOne({username: username});
  const userByDisplayName = await User.findOne({displayName: displayName});
  if (userByName || userByDisplayName) {
    return null;
  }

  const registerDate = Date.now();
  const newUser = await new User({
    username: username,
    password: password,
    displayName: displayName,
    profilePicture: profilePicture,
    registerDate: registerDate
  });
  await newUser.save();
  return true;
}

/**
 * Given a username and password (Hashed already) creates a token so the user can make api requests.
 * @param username The username.
 * @param password The hashed password of that username.
 */
async function generateToken(username: string, password: string): Promise<string> {
  const payload = {
    username,
    password
  };

  const existingUser = await User.findOne({username: username, password: password});
  if (!existingUser) {
    throw new Error('Wrong password or username');
  }

  const key = process.env.SECRET_AUTH_KEY || 'default-auth-secret';

  return jwt.sign(payload, key, {expiresIn: '1h'});
}

export const registerService = {
  getUserByUsername,
  registerUser,
  generateToken
};