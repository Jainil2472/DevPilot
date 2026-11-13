import express from 'express';
import authRouter from './routes/Auth/auth.routes.js';
import projectRouter from './routes/Project/project.routes.js';
import { authentication } from './middlewares/authentication.middleware.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use('/user',authRouter);
app.use('/project',authentication,projectRouter);

app.use(errorHandler)
export default app;