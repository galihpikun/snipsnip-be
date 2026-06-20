import { createSnippet, getSnippets } from "../controllers/snippetController.js";
import { jwtMiddleware } from "../middlewares/authMiddleware.js";
import express from 'express';

const routerSnippet = express.Router();

routerSnippet.post('/', jwtMiddleware, createSnippet);
routerSnippet.get('/', jwtMiddleware, getSnippets);

export default routerSnippet;