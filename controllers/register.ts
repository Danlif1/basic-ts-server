import {Request, Response} from 'express';
import {hashPassword} from "../utils/encrypt";
import {IUserRequest} from "../models/interfaces";
import {registerService} from '../services/register';
import {logAction, logInternalError} from "../utils/logger";

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
    await logAction(`Accessed user ${user.username} data from user: ${req.user.username.toLowerCase()}`);
    return res.status(200).json(user);
  } catch (error: any) {
    if (error.message === 'You do not have premission to view this user\'s data') {
      return res.status(404).json({error: error.message});
    }
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
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(409).json({error: 'Please provide a username and password'});
    }
    await registerService.registerUser(req.body.username.toLowerCase(),
      req.body.displayName,
      hashPassword(req.body.password),
      req.body.profilePicture);
    await logAction(`Registered user ${req.body.username.toLowerCase()}`);
    return res.status(200).json({message: 'Success'});
  } catch (error: any) {
    if (error.message === 'Please fill all required fields') {
      return res.status(400).json({error: error.message});
    } else if (error.message === 'Username is already taken') {
      return res.status(409).json({error: error.message});
    }
    return res.status(500).json({error: 'Internal server error'});
  }
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
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(404).json({error: 'invalid username and or password'});
    }
    const token = await registerService.generateToken(req.body.username.toLowerCase(), hashPassword(req.body.password));
    res.send(token);
  } catch (error: any) {
    return res.status(404).json({error: error.message});
  }
  const token = await registerService.generateToken(req.body.username.toLowerCase(), hashPassword(req.body.password));
  if (!token) {
    return res.status(404).json({error: 'invalid username and or password'});
  }
  await logAction(`Generated token for: ${req.body.username.toLowerCase()}`);
  res.send(token);
}

export const registerController = {
  getUserByUsername,
  registerUser,
  redirectHome,
  generateToken
};