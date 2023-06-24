import express, { Request, Response } from 'express';
import validateResource from '../middleware/validateResource';
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from '../schema/user.schema';
import { createUserHandler, forgotPasswordHandler, resetPasswordHandler, verifyUserHandler } from '../controller/user.controller';

const userRouter = express.Router();

userRouter.post('/api/users', validateResource(createUserSchema), createUserHandler);
userRouter.post('/api/users/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler);
userRouter.post('/api/users/forgotpassword', validateResource(forgotPasswordSchema), forgotPasswordHandler);
userRouter.post('/api/users/resetpassword/:id/:passwordResetCode', validateResource(resetPasswordSchema), resetPasswordHandler);
export default userRouter;
