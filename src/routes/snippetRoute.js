import { createSnippet, deleteSnippet, getSnippetById, getSnippets, updateSnippet } from "../controllers/snippetController.js";
import { jwtMiddleware } from "../middlewares/authMiddleware.js";
import express from 'express';

const routerSnippet = express.Router();
// Statis
routerSnippet.post('/', jwtMiddleware, createSnippet);
routerSnippet.get('/', jwtMiddleware, getSnippets);

// Dinamis
routerSnippet.put('/:id', jwtMiddleware, updateSnippet);
routerSnippet.delete('/:id', jwtMiddleware, deleteSnippet);
routerSnippet.get('/:id', jwtMiddleware, getSnippetById);

export default routerSnippet;