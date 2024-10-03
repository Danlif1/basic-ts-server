import express, {Router} from 'express';
import {registerController} from '../controllers/register';

const registerRouter: Router = express.Router();
const {authenticateToken} = require('../middleware/authenticateToken');


registerRouter.post('/tokens', registerController.generateToken);
registerRouter.get('/users/:username', authenticateToken, registerController.getUserByUsername);
registerRouter.post('/users', registerController.registerUser);
registerRouter.get('/*', registerController.redirectHome);

export default registerRouter;
