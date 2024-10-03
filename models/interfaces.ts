import {Request} from "express";

/**
 * In requests after authentication there is a user data holding the username and password (password is hashed)
 * This interface account for them.
 */
interface IUserRequest extends Request {
  user?: {
    username: string;
  };
}


export {IUserRequest};