import nodemailer, { SendMailOptions } from 'nodemailer';
import { config } from '../config/config';
import log from './logger';

// async function createTestCreds() {
//     const creds = await nodemailer.createTestAccount();
//     console.log({ creds });
// }

// createTestCreds();

const smtp = <{ user: string; pass: string; host: string; port: number; secure: boolean }>{
    user: config.smtp.user,
    pass: config.smtp.pass,
    host: config.smtp.host,
    port: Number(config.smtp.port),
    secure: config.smtp.secure === 'true'
};

const transporter = nodemailer.createTransport({
    ...smtp,
    auth: { user: smtp.user, pass: smtp.pass }
});

async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            log.error(err, 'Error sending email');
            return;
        }

        log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    });
}

export default sendEmail;
