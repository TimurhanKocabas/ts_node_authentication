import UserModel, { User } from '../model/user.model';

async function createUser(input: Partial<User>) {
    return UserModel.create(input);
}

async function findUserById(id: string) {
    return UserModel.findById(id);
}

async function findUserByEmail(email: string) {
    return await UserModel.findOne({ email });
}

async function updateResetToken(id: string, passwordResetCode: string) {
    const user = await UserModel.findByIdAndUpdate(id, { passwordResetCode }, { new: true });
    return user;
}

async function updatePassword(id: string, password: string) {
    const user = await UserModel.findById(id);
    user!.password = password;
    user!.passwordResetCode = null;
    await user!.save();
    return user;
}
export default {
    createUser,
    findUserByEmail,
    findUserById,
    updateResetToken,
    updatePassword
};
