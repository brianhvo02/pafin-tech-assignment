import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import User from '../../../src/db/models/User';
import dbConnection from '../../../src/db/config';
import request from 'supertest';
import app from '../../../src';

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

    // describe('Get user by credentials', () => {
    //     it('should get a user with email and password', async () => {
    //         const user = await getUserByCredentials('jdoe@test.com', 'Password123');

    //         expect(user).not.toBeNull();
    //     });

    //     it('should NOT get a user with incorrect email or password', async () => {
    //         await expect(async () => 
    //             getUserByCredentials('jdoe@test.com', 'Password')
    //         ).rejects.toThrowError();

    //         await expect(async () => 
    //             getUserByCredentials('jdoe@test', 'Password123')
    //         ).rejects.toThrowError();
    //     });
    // });

    // describe('Update user', () => {
    //     it('should update and return a user', async () => {
    //         const user = await getUserByCredentials('jdoe@test.com', 'Password123');
    //         const updatedUser = await updateUserById(user.id, {
    //             name: 'Jane Doe'
    //         });

    //         expect(updatedUser).toMatchObject({
    //             ...user.toJSON(),
    //             name: 'Jane Doe'
    //         });
    //     });
    // });

    // describe('Delete user by id', () => {
    //     it('should delete a user', async () => {
    //         const user = await getUserByCredentials('jdoe@test.com', 'Password123');
    //         const deletedUser = await deleteUserById(user.id);

    //         expect(deletedUser).toEqual(true);
    //     });
    // });
});