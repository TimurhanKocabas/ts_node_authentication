import { Request, Response } from 'express';
import log from '../utils/logger';
import { createUser, findUserById } from '../data/service/user.service';
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/user.schema';
import sendEmail from '../utils/mailer';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    const body = req.body;
    try {
        const user = await createUser(body);

        await sendEmail({
            to: user.email,
            from: 'test@example.com',
            subject: 'Verify your email',
            text: `verification code: ${user.verificationCode}. Id: ${user._id}`
        });

        return res.send('User successfully created');
    } catch (e: any) {
        //  we don't check user email if user has been created already but because in user.model.ts email property has unique constraint it throws an error so we catch it here
        if (e.code === 11000) {
            return res.status(409).send('Account already exists');
        }

        return res.status(500).send(e);
    }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;

    // find the user by id
    const user = await findUserById(id);

    if (!user) {
        return res.send('Could not verify user');
    }

    // check to see if they are already verified
    if (user.verified) {
        return res.send('User is already verified');
    }

    // check to see if the verificationCode matches
    if (user.verificationCode === verificationCode) {
        user.verified = true;

        await user.save();

        return res.send('User successfully verified');
    }

    return res.send('Could not verify user');
}
