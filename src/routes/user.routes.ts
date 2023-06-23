import express, { Request, Response } from 'express';
import validateResource from '../middleware/validateResource';
import { createUserSchema, verifyUserSchema } from '../schema/user.schema';
import { createUserHandler, verifyUserHandler } from '../controller/user.controller';

const userRouter = express.Router();

userRouter.post('/api/users', validateResource(createUserSchema), createUserHandler);
userRouter.post('/api/users/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler);

export default userRouter;
