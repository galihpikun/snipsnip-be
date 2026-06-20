import express from 'express'
import cors from 'cors';
import routerAuth from './src/routes/authRoute.js';
import routerSnippet from './src/routes/snippetRoute.js';
import routeSnipFiles from './src/routes/snippetFilesRoute.js';


const app = express()
const port = 3000

app.use(express.json());
app.use(cors());

app.use("/api/auth", routerAuth)
app.use('/api/snippets', routerSnippet);
app.use('/api/snippet-files', routeSnipFiles);

app.get('/', (req, res) => {
  res.send('Code Snippet API is succesfully running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})