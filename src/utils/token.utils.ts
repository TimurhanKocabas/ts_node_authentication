import { nanoid } from 'nanoid';

export function generatePasswordResetToken(): string {
    const token = nanoid();
    return token;
}
