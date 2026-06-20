import express from 'express';
import { getMe, login, logout, register, updateMe } from '../controllers/authController.js';
import { jwtMiddleware } from '../middlewares/authMiddleware.js';

const routerAuth = express.Router();

routerAuth.post('/register', register);
routerAuth.post('/login', login);
routerAuth.get('/get-me', jwtMiddleware,getMe);
routerAuth.get('/logout', jwtMiddleware,logout);
routerAuth.patch('/update-me', jwtMiddleware,updateMe);

export default routerAuth;