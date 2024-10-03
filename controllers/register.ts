import { Request, Response } from 'express';
import {hashPassword} from "../middleware/encrypt";

const registerService = require('../services/register');

const {join} = require("path");

interface registerRequest extends Request {
    user?: {
        username: string;
    };
}

async function getUserByUsername(req: registerRequest, res: Response): Promise<Response> {
    try {
        if (!req.user || !req.user.username) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = await registerService.getUserByUsername(req.params.username.toLowerCase(), req.user.username.toLowerCase());
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function registerUser(req: Request, res: Response): Promise<Response> {
    if (!req.body.Username) {
        return res.status(409).json({ error: 'Please provide a username' });
    }
    const user = await registerService.registerUser(req.body.Username.toLowerCase(),
        req.body.DisplayName,
        hashPassword(req.body.Password),
        req.body.ProfilePicture);
    if (!user) {
        return res.status(409).json({ error: 'Username already exists' });
    }
    return res.status(200).json({ message: 'Success' });
}

async function redirectHome(req: Request, res: Response): Promise<void> {
    res.sendFile(join(__dirname,'..', 'public', 'index.html'));
}

async function generateToken(req: Request, res: Response) {
    if (!req.body.Username || !req.body.Password) {
        return res.status(404).json({ error: 'invalid username and or password' });
    }
    const token = await registerService.generateToken(req.body.Username.toLowerCase(), hashPassword(req.body.Password));
    if (!token) {
        return res.status(404).json({ error: 'invalid username and or password' });
    }
    res.send(token);
}

export const registerController = {
    getUserByUsername,
    registerUser,
    redirectHome,
    generateToken
};