import {Request, Response, NextFunction} from 'express';
import {authenticateToken} from './authenticateToken';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

interface CustomRequest extends Request {
  user?: { username: string };
}

describe('authenticateToken', () => {
  let req: CustomRequest;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    } as CustomRequest;
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  test('should call next if token is valid', () => {
    const mockToken = 'valid.token.here';
    const mockUser = {username: 'testuser'};

    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    req.headers['authorization'] = `Bearer ${mockToken}`;
    authenticateToken(req, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({username: 'testuser'});
  });

  test('should respond with 401 if no token is provided', () => {
    authenticateToken(req, res as Response, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('should respond with 403 if token is invalid', () => {
    const mockToken = 'invalid.token.here';

    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error('Token is invalid'), null);
    });

    req.headers['authorization'] = `Bearer ${mockToken}`;
    authenticateToken(req, res as Response, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
