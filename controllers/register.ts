import {Request, Response} from 'express';
import {hashPassword} from "../middleware/encrypt";
import {IUserRequest} from "../models/interfaces";

const registerService = require('../services/register');

const {join} = require("path");


/**
 * Given a username, return that user's data.
 * @param req In the request there should be the username wanted in the path.
 * @param res In the result there would be either an error with the correlated error message,
 * or the user's data.
 */
async function getUserByUsername(req: IUserRequest, res: Response): Promise<Response> {
  try {
    if (!req.user || !req.user.username) {
      return res.status(404).json({error: 'User not found'});
    }
    const user = await registerService.getUserByUsername(req.params.username.toLowerCase(), req.user.username.toLowerCase());
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({error: 'Internal server error'});
  }
}

/**
 * Registering a user.
 * @param req In the request there should be: username, password, displayName (all required),
 * and profilePicture (optional).
 * @param res In the result there would be either an error with the correlated error message,
 * or the message Success with status 200.
 */
async function registerUser(req: Request, res: Response): Promise<Response> {
  if (!req.body.username) {
    return res.status(409).json({error: 'Please provide a username'});
  }
  const user = await registerService.registerUser(req.body.username.toLowerCase(),
    req.body.displayName,
    hashPassword(req.body.password),
    req.body.profilePicture);
  if (!user) {
    return res.status(409).json({error: 'Username already exists'});
  }
  return res.status(200).json({message: 'Success'});
}

/**
 * Redirects home.
 * @param req Nothing/Everything.
 * @param res the frontend.
 */
async function redirectHome(req: Request, res: Response): Promise<void> {
  res.sendFile(join(__dirname, '..', 'public', 'index.html'));
}

/**
 * Login.
 * @param req In the request there should be: username, and password.
 * @param res In the result there would be either an error with the correlated error message,
 * or the token correlated to the user requesting it.
 */
async function generateToken(req: Request, res: Response) {
  if (!req.body.username || !req.body.password) {
    return res.status(404).json({error: 'invalid username and or password'});
  }
  const token = await registerService.generateToken(req.body.username.toLowerCase(), hashPassword(req.body.password));
  if (!token) {
    return res.status(404).json({error: 'invalid username and or password'});
  }
  res.send(token);
}

export const registerController = {
  getUserByUsername,
  registerUser,
  redirectHome,
  generateToken
};