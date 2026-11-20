import express from 'express';
import authRouter from './routes/Auth/auth.routes.js';
import projectRouter from './routes/Project/project.routes.js';
import { authentication } from './middlewares/authentication.middleware.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import projectMembershipRequest from './routes/Project/projectMembershipRequest.routes.js'
import projectMembership from './routes/Project/projectMebership.routes.js'
import cors from 'cors'; 
const app = express();


app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    })
);


app.use(express.json());
app.use(cookieParser());


app.use('/user',authRouter);
app.use('/project',authentication,projectRouter);
app.use('/project',authentication,projectMembership)
app.use('/project',authentication,projectMembershipRequest)

app.use(errorHandler)
export default app;