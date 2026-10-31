import express from 'express';
import authRouter from './routes/auth.routes.js';
import projectRouter from './routes/project.routes.js';
import { authentication } from './middlewares/authentication.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json())
app.use(cookieParser())


app.use('/user',authRouter)
app.use('/project',authentication,projectRouter)

export default app;