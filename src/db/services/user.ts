/** @module db/services/user */

import { UUID } from 'crypto';
import User, { UserInput } from '../models/User';

/**
 * Creates a new user
 * @async
 * @param {UserInput} payload
 * @returns {Promise.<User>} instance of the newly created user
 */
export const createUser = async (payload: UserInput): Promise<User> => User.create(payload);

/**
 * Gets the user with the given id from the database.
 * @async
 * @param {UUID} id - the id of the user
 * @returns {Promise.<User>} the user instance
 * @throws This exception is thrown if no user is found in the database.
 */
export const getUserById = async (id: UUID): Promise<User> => {
    const user = await User.findByPk(id);
    if (!user)
        throw new Error('User not found');

    return user;
}

/**
 * Gets the user with the given email and password.
 * @async
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise.<User>} the user instance
 */
export const getUserByCredentials = async (email: string, password: string): Promise<User> => {
    const user = await User.findOne({ where: { email }});
    if (!user || !await user.checkPassword(password))
        throw new Error('Invalid credentials');

    return user;
}

/**
 * Updates the user info of the user with the given id.
 * @async
 * @param {UUID} id 
 * @param {Partial.<UserInput>} payload 
 * @returns {Promise.<User>} the user instance
 */
export const updateUserById = async (id: UUID, payload: Partial<UserInput>): Promise<User> => {
    const user = await getUserById(id);
    return user.update(payload);
}

/**
 * Deletes the user with the given id.
 * @async
 * @param {UUID} id 
 * @returns {Promise.<boolean>}
 */
export const deleteUserById = async (id: UUID): Promise<boolean> => {
    return !!User.destroy({ where: { id } });
}