import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import User from '../../../src/db/models/User';
import { createUser, deleteUserById, getUserByCredentials, updateUserById } from '../../../src/db/services/user';
import dbConnection from '../../../src/db/config';

const dbReset = async () => User.destroy({ where: { email: 'user_model@test.com' } });

describe('User model', () => {
    beforeAll(async () => dbReset());
    afterAll(async () => {
        await dbReset();
        await dbConnection.close();
    });

    describe('Create user', () => {
        it('should create and return a new user', async () => {
            const user = await createUser({
                name: 'User Model',
                email: 'user_model@test.com',
                password: 'Password123'
            });

            expect(user).not.toBeNull();
        });

        it('should NOT create a user if email is invalid', async () => {
            await expect(async () =>
                createUser({
                    name: 'Bad User Model',
                    email: 'bad_user_model@test',
                    password: 'Password123'
                })
            ).rejects.toThrowError();
        });

        it('should NOT create a user if password is less than 6', async () => {
            await expect(async () =>
                createUser({
                    name: 'Bad User Model',
                    email: 'bad_user_model@test.com',
                    password: 'Pass'
                })
            ).rejects.toThrowError();
        });

        it('should NOT create a user if password is greater than 255', async () => {
            await expect(async () =>
                createUser({
                    name: 'Bad User Model',
                    email: 'bad_user_model@test.com',
                    password: [...Array(256).keys()].map(() => 'x').join('')
                })
            ).rejects.toThrowError();
        });

        it('should NOT create a user if password contains non-alphanumeric characters', async () => {
            await expect(async () =>
                createUser({
                    name: 'Bad User Model',
                    email: 'bad_user_model@test.com',
                    password: 'Password123!'
                })
            ).rejects.toThrowError();
        });
    });

    describe('Get user by credentials', () => {
        it('should get a user with email and password', async () => {
            const user = await getUserByCredentials('user_model@test.com', 'Password123');

            expect(user).not.toBeNull();
        });

        it('should NOT get a user with incorrect email or password', async () => {
            await expect(async () => 
                getUserByCredentials('user_model@test.com', 'Password')
            ).rejects.toThrowError();

            await expect(async () => 
                getUserByCredentials('user_model@test', 'Password123')
            ).rejects.toThrowError();
        });
    });

    describe('Update user', () => {
        it('should update and return a user', async () => {
            const user = await getUserByCredentials('user_model@test.com', 'Password123');
            const updatedUser = await updateUserById(user.id, {
                name: 'Jane Doe'
            });

            expect(updatedUser.toJSON()).toMatchObject({
                ...user.toJSON(),
                name: 'Jane Doe'
            });
        });
    });

    describe('Delete user by id', () => {
        it('should delete a user', async () => {
            const user = await getUserByCredentials('user_model@test.com', 'Password123');
            const deletedUser = await deleteUserById(user.id);

            expect(deletedUser).toEqual(true);
        });
    });
});