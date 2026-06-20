import express from 'express';
import { jwtMiddleware } from '../middlewares/authMiddleware.js';
import { createSnippetFile, deleteSnippetFile, getSnippetFiles, updateSnippetFile } from '../controllers/snippetFilesController.js';

const routeSnipFiles = express.Router();

routeSnipFiles.get('/:id', jwtMiddleware, getSnippetFiles);
routeSnipFiles.post('/:id', jwtMiddleware, createSnippetFile);
routeSnipFiles.patch('/:id', jwtMiddleware, updateSnippetFile);
routeSnipFiles.delete('/:id', jwtMiddleware, deleteSnippetFile)

export default routeSnipFiles;