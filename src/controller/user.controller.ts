import { Request, Response, response } from 'express';
import log from '../utils/logger';
import UserService from '../data/service/user.service';
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/user.schema';
import sendEmail from '../utils/mailer';
import { generatePasswordResetToken } from '../utils/token.utils';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    const body = req.body;
    try {
        const user = await UserService.createUser(body);

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
    const user = await UserService.findUserById(id);

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

export async function forgotPasswordHandler(req: Request<ForgotPasswordInput>, res: Response) {
    const message = 'If a user with that email is registered you will receive a password reset email';
    const { email } = req.body;
    const user = await UserService.findUserByEmail(email);

    if (!user) {
        log.debug(`User with emailt ${email} doesn not exist`);
        return res.status(404).json(message);
    }

    if (!user.verified) {
        log.debug(`User is not verified`);
        return res.status(403).json({ error: 'User is not verified' });
    }

    const passwordResetCode = generatePasswordResetToken();
    UserService.updateResetToken(user.id, passwordResetCode);

    await sendEmail({
        to: user.email,
        from: 'test@example.com',
        subject: 'Reset your password',
        text: `Password reset code: ${passwordResetCode}. Id: ${user._id}`
    });

    log.debug(`Password reset email sent successfully.Email: ${email}`);
    return res.send(message);
}

export async function resetPasswordHandler(req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res: Response) {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    const user = await UserService.findUserById(id);
    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
        return res.status(400).send('Could not reset user password');
    }
    await UserService.updatePassword(id, password);
    res.send('Successfully updated password');
}
