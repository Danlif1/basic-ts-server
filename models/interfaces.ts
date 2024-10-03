import {Request} from "express";

interface IUserRequest extends Request {
  user?: {
    username: string;
  };
}



export {IUserRequest};