import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import User from '../../../src/db/models/User';
import dbConnection from '../../../src/db/config';
import request from 'supertest';
import app from '../../../src';

const dbReset = async () => User.destroy({ where: { email: 'auth_routes@test.com' } });

describe('Auth routes', () => {
    beforeAll(async () => dbReset());
    afterAll(async () => {
        await dbReset();
        await dbConnection.close();
    });

    describe('POST /signup', () => {
        it('should create and return a new user', async () => {
            const params = {
                name: 'Auth Routes',
                email: 'auth_routes@test.com',
                password: 'Password123'
            };

            const { statusCode, body } = await request(app).post('/signup').send(params);

            expect(statusCode).toBe(200);
            expect(body).toHaveProperty('token');
        });

        it('should NOT create a user if email is invalid', async () => {
            const params = {
                name: 'Auth Routes',
                email: 'auth_routes@test',
                password: 'Password123'
            };

            const { statusCode, body } = await request(app).post('/signup').send(params);

            expect(statusCode).toBe(422);
            expect(body).toHaveProperty('errors');
        });

        it('should NOT create a user if password is less than 6', async () => {
            const params = {
                name: 'Bad Auth Routes',
                email: 'bad_auth_routes@test.com',
                password: 'Pass'
            };

            const { statusCode, body } = await request(app).post('/signup').send(params);

            expect(statusCode).toBe(422);
            expect(body).toHaveProperty('errors');
        });

        it('should NOT create a user if password is greater than 255', async () => {
            const params = {
                name: 'Bad Auth Routes',
                email: 'bad_auth_routes@test.com',
                password: [...Array(256).keys()].map(() => 'x').join('')
            };

            const { statusCode, body } = await request(app).post('/signup').send(params);

            expect(statusCode).toBe(422);
            expect(body).toHaveProperty('errors');
        });

        it('should NOT create a user if password contains non-alphanumeric characters', async () => {
            const params = {
                name: 'Bad Auth Routes',
                email: 'bad_auth_routes@test.com',
                password: 'Password123!'
            };

            const { statusCode, body } = await request(app).post('/signup').send(params);

            expect(statusCode).toBe(422);
            expect(body).toHaveProperty('errors');
        });

        it('should NOT create a user if email is already taken', async () => {
            const params = {
                name: 'Bad Auth Routes',
                email: 'auth_routes@test.com',
                password: 'Password'
            };

            const { statusCode, body } = await request(app).post('/signup').send(params);

            expect(statusCode).toBe(422);
            expect(body).toHaveProperty('errors');
        });
    });

    describe('POST /login', () => {
        it('should login a user with credentials', async () => {
            const params = {
                email: 'auth_routes@test.com',
                password: 'Password123'
            };

            const { statusCode, body } = await request(app).post('/login').send(params);

            expect(statusCode).toBe(200);
            expect(body).toHaveProperty('token');
        });

        it('should NOT login a user with incorrect credentials', async () => {
            const params = {
                email: 'auth_routes@test.com',
                password: 'Password'
            };

            const { statusCode, body } = await request(app).post('/login').send(params);

            expect(statusCode).toBe(401);
            expect(body).toHaveProperty('errors');
        });
    })
});