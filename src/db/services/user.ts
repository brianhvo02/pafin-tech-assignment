import { UUID } from 'crypto';
import User, { UserInput } from '../models/User';

export const create = async (payload: UserInput) => User.create(payload);

export const getById = async (id: UUID) => {
    const user = await User.findByPk(id);
    if (!user)
        throw new Error('User not found');

    return user;
}

export const getByCredentials = async (email: string, password: string) => {
    const user = await User.findOne({ where: { email }});
    if (!user || !await user.checkPassword(password))
        throw new Error('Invalid credentials');

    return user;
}

export const updateById = async (id: UUID, payload: Partial<UserInput>) => {
    const user = await getById(id);

    return user.update(payload);
}

export const deleteById = async (id: UUID) => {
    return !!User.destroy({ where: { id } });
}