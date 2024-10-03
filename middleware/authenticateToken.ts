import {Request, Response, NextFunction} from 'express';
import * as dotenv from 'dotenv';
import {join} from 'path';
import jwt from 'jsonwebtoken';
import {IUserRequest} from "../models/interfaces";

/**
 * This function should be called before any api request that needs you to log in to work.
 * @param req In the request there should be the authorization token in the format bearer [token] in the header.
 * @param res Error status/Nothing.
 * @param next The next function (Only called if the authentication works.
 */
export function authenticateToken(req: IUserRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401); // Send status code and return early
    return;
  }

  jwt.verify(token, process.env.SECRET_AUTH_KEY || 'default-auth-secret', (err, user) => {
    if (err) {
      res.sendStatus(403); // Send status code and return early
      return;
    }

    // Type assertion to specify the shape of `user`
    if (user && typeof user !== 'string') {
      req.user = {username: (user as any).username}; // Adjust as needed based on your JWT payload
    }

    next();
  });
}

