import express from 'express';
import { jwtMiddleware } from '../middlewares/authMiddleware.js';
import { getUserById } from '../controllers/userController.js';

const routeUser = express.Router();

routeUser.get('/:id', jwtMiddleware, getUserById);

export default routeUser;