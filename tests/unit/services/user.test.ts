import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import User from '../../../src/db/models/User';
import { createUser, deleteUserById, getUserByCredentials, updateUserById } from '../../../src/db/services/user';
import dbConnection from '../../../src/db/config';

const dbReset = async () => {
    await User.sequelize?.query('SET CONSTRAINTS ALL DEFERRED');
    await User.destroy({ cascade: true, truncate: true, force: true });
    await User.sequelize?.query("SET CONSTRAINTS ALL IMMEDIATE");
}

describe('User model', () => {
    beforeAll(async () => dbReset());
    afterAll(async () => {
        await dbReset();
        await dbConnection.close();
    });

    describe('Create user', () => {
        it('should create and return a new user', async () => {
            const user = await createUser({
                name: 'John Doe',
                email: 'jdoe@test.com',
                password: 'Password123'
            });

            expect(user).not.toBeNull();
        });

        it('should NOT create a user if email is invalid', async () => {
            await expect(async () =>
                createUser({
                    name: 'Bad John Doe',
                    email: 'bad_jdoe@test',
                    password: 'Password123'
                })
            ).rejects.toThrowError();
        });

        it('should NOT create a user if password is less than 6', async () => {
            await expect(async () =>
                createUser({
                    name: 'Bad John Doe',
                    email: 'bad_jdoe@test.com',
                    password: 'Pass'
                })
            ).rejects.toThrowError();
        });

        it('should NOT create a user if password is greater than 255', async () => {
            await expect(async () =>
                createUser({
                    name: 'Bad John Doe',
                    email: 'bad_jdoe@test.com',
                    password: [...Array(256).keys()].map(() => 'x').join('')
                })
            ).rejects.toThrowError();
        });

        it('should NOT create a user if password contains non-alphanumeric characters', async () => {
            await expect(async () =>
                createUser({
                    name: 'Bad John Doe',
                    email: 'bad_jdoe@test.com',
                    password: 'Password123!'
                })
            ).rejects.toThrowError();
        });
    });

    describe('Get user by credentials', () => {
        it('should get a user with email and password', async () => {
            const user = await getUserByCredentials('jdoe@test.com', 'Password123');

            expect(user).not.toBeNull();
        });

        it('should NOT get a user with incorrect email or password', async () => {
            await expect(async () => 
                getUserByCredentials('jdoe@test.com', 'Password')
            ).rejects.toThrowError();

            await expect(async () => 
                getUserByCredentials('jdoe@test', 'Password123')
            ).rejects.toThrowError();
        });
    });

    describe('Update user', () => {
        it('should update and return a user', async () => {
            const user = await getUserByCredentials('jdoe@test.com', 'Password123');
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
            const user = await getUserByCredentials('jdoe@test.com', 'Password123');
            const deletedUser = await deleteUserById(user.id);

            expect(deletedUser).toEqual(true);
        });
    });
});