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

describe('Auth routes', () => {
    beforeAll(async () => dbReset());
    afterAll(async () => {
        await dbReset();
        await dbConnection.close();
    });

    describe('POST /signup', () => {
        it('should create and return a new user', async () => {
            const params = {
                name: 'John Doe',
                email: 'jdoe@test.com',
                password: 'Password123'
            };

            const res = await request(app).post('/signup').send(params);

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toEqual(params.name);
            expect(res.body.email).toEqual(params.email);
        });

        it('should NOT create a user if email is invalid', async () => {
            const params = {
                name: 'John Doe',
                email: 'jdoe@test',
                password: 'Password123'
            };

            const res = await request(app).post('/signup').send(params);

            expect(res.statusCode).toBe(422);
            expect(res.body).toHaveProperty('errors');
        });

        it('should NOT create a user if password is less than 6', async () => {
            const params = {
                name: 'Bad John Doe',
                email: 'bad_jdoe@test.com',
                password: 'Pass'
            };

            const res = await request(app).post('/signup').send(params);

            expect(res.statusCode).toBe(422);
            expect(res.body).toHaveProperty('errors');
        });

        it('should NOT create a user if password is greater than 255', async () => {
            const params = {
                name: 'Bad John Doe',
                email: 'bad_jdoe@test.com',
                password: [...Array(256).keys()].map(() => 'x').join('')
            };

            const res = await request(app).post('/signup').send(params);

            expect(res.statusCode).toBe(422);
            expect(res.body).toHaveProperty('errors');
        });

        it('should NOT create a user if password contains non-alphanumeric characters', async () => {
            const params = {
                name: 'Bad John Doe',
                email: 'bad_jdoe@test.com',
                password: 'Password123!'
            };

            const res = await request(app).post('/signup').send(params);

            expect(res.statusCode).toBe(422);
            expect(res.body).toHaveProperty('errors');
        });

        it('should NOT create a user if email is already taken', async () => {
            const params = {
                name: 'Bad John Doe',
                email: 'jdoe@test.com',
                password: 'Password'
            };

            const res = await request(app).post('/signup').send(params);

            expect(res.statusCode).toBe(422);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('POST /login', () => {
        it('should login a user with credentials', async () => {
            const params = {
                email: 'jdoe@test.com',
                password: 'Password123'
            };

            const res = await request(app).post('/login').send(params);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should NOT login a user with incorrect credentials', async () => {
            const params = {
                email: 'jdoe@test.com',
                password: 'Password'
            };

            const res = await request(app).post('/login').send(params);

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('errors');
        });
    })
});