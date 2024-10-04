import {registerService} from '../services/register';
import {User} from '../models/user';
import jwt from 'jsonwebtoken';
import {logError, logForbidden} from '../utils/logger';

jest.mock('../models/user');
jest.mock('jsonwebtoken');
jest.mock('../utils/logger');


describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  test('should return null and log an error if any attribute is missing', async () => {
    const result = await registerService.registerUser(null, 'TestDisplay', 'password123', 'profilePic.png');
    expect(result).toBeNull();
    expect(logError).toHaveBeenCalledWith('Missing an attribute for registering a user: null, TestDisplay, password123');
  });

  test('should assign a default profile picture if none is provided', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null); // Mock no existing user
    const result = await registerService.registerUser('testuser', 'TestDisplay', 'password123', null);

    expect(User).toHaveBeenCalledWith(expect.objectContaining({
      profilePicture: 'default'
    }));
    expect(result).toBe(true);
  });

  test('should return null and log an error if username is already taken', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce({}); // Mock existing user by username

    const result = await registerService.registerUser('existinguser', 'TestDisplay', 'password123', 'profilePic.png');

    expect(result).toBeNull();
    expect(logError).toHaveBeenCalledWith(
      'Tried creating a user but either username or displayName were already taken existinguser, TestDisplay'
    );
  });

  test('should return null and log an error if display name is already taken', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null); // No user by username
    (User.findOne as jest.Mock).mockResolvedValueOnce({});  // Existing user by display name

    const result = await registerService.registerUser('testuser', 'existingDisplayName', 'password123', 'profilePic.png');

    expect(result).toBeNull();
    expect(logError).toHaveBeenCalledWith(
      'Tried creating a user but either username or displayName were already taken testuser, existingDisplayName'
    );
  });

  test('should successfully register a user if all fields are valid', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null); // No user exists with the same username or display name
    const mockSave = jest.fn().mockResolvedValue(true);
    (User.prototype.save as jest.Mock) = mockSave;  // Mock the save function

    const result = await registerService.registerUser('testuser', 'TestDisplay', 'password123', 'profilePic.png');

    expect(result).toBe(true);
    expect(mockSave).toHaveBeenCalled();
  });

  describe('getUserByUsername', () => {
    test('should return user data if the header username matches', async () => {
      const mockUser = {username: 'testuser', displayName: 'Test User'};
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser); // Mocking found user

      const result = await registerService.getUserByUsername('testuser', 'testuser');
      expect(result).toEqual(mockUser); // Ensure the returned user is correct
    });

    test('should return null if the header username does not match', async () => {
      const result = await registerService.getUserByUsername('testuser', 'anotheruser');
      expect(result).toBeNull(); // Ensure no user is returned
      expect(logForbidden).toHaveBeenCalledWith('User: anotheruser tried accessing user: testuser data');
    });

    test('should return null if the user does not exist', async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce(null); // Ensure this mock returns null

      const result = await registerService.getUserByUsername('nonexistentuser', 'nonexistentuser');
      expect(result).toBeNull(); // Ensure no user is returned
      expect(logError).toHaveBeenCalledWith('No user with username: nonexistentuser found');
    });
  });

  describe('generateToken', () => {
    test('should generate a token successfully', async () => {
      const mockToken = 'mocked.token.here';
      const username = 'testuser';
      const password = 'hashedpassword';

      (jwt.sign as jest.Mock).mockReturnValueOnce(mockToken); // Mocking token generation

      const result = await registerService.generateToken(username, password);
      expect(result).toBe(mockToken); // Ensure the token returned is correct

      const key = process.env.SECRET_AUTH_KEY || 'default-auth-secret';
      expect(jwt.sign).toHaveBeenCalledWith(
        {username, password},
        key,
        {expiresIn: '1h'}
      ); // Ensure jwt.sign was called with correct parameters
    });
  });
});
