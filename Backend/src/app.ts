import express from 'express';
import authrouter from './routes/auth.routes.js';

const app = express();

app.use(express.json())
app.use('/user',authrouter)

export default app;