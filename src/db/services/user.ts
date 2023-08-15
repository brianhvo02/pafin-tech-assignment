import { UUID } from 'crypto';
import User, { UserInput } from '../models/User';

export const createUser = async (payload: UserInput) => User.create(payload);

export const getUserById = async (id: UUID) => {
    const user = await User.findByPk(id);
    if (!user)
        throw new Error('User not found');

    return user;
}

export const getUserByCredentials = async (email: string, password: string) => {
    const user = await User.findOne({ where: { email }});
    if (!user || !await user.checkPassword(password))
        throw new Error('Invalid credentials');

    return user;
}

export const updateUserById = async (id: UUID, payload: Partial<UserInput>) => {
    const user = await getUserById(id);

    return user.update(payload);
}

export const deleteUserById = async (id: UUID) => {
    return !!User.destroy({ where: { id } });
}