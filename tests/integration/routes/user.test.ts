import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import User from '../../../src/db/models/User';
import dbConnection from '../../../src/db/config';
import request from 'supertest';
import app from '../../../src';

const dbReset = async () => User.destroy({ where: { email: 'user_routes@test.com' } });
let userToken: string;
const user = {
    name: 'User Routes Test',
    email: 'user_routes@test.com',
    password: 'Password123'
};

describe('User routes', () => {
    beforeAll(async () => {
        await dbReset();
        const { body: { token } } = await request(app).post('/signup').send(user);
        userToken = token;
    });
    afterAll(async () => {
        await dbReset();
        await dbConnection.close();
    });

    describe('GET /user', () => {
        it('should get the current user', async () => {
            const { statusCode, body } = await request(app).get('/user')
                .set('Authorization', `Bearer ${userToken}`).send();

            expect(statusCode).toBe(200);
            expect(body.email).toEqual(user.email);
        });

        it('should NOT get the current user without a token', async () => {
            const { statusCode } = await request(app).get('/user').send();

            expect(statusCode).toBe(401);
        });
    });

    describe('PATCH /user', () => {
        it('should update and return the updated current user', async () => {
            const params = {
                name: 'User Routes Test 01'
            }

            const { statusCode, body } = await request(app).patch('/user')
                .set('Authorization', `Bearer ${userToken}`).send(params);

            expect(statusCode).toBe(200);
            expect(body.name).toEqual(params.name);
            expect(body.email).toEqual(user.email);
        });
    });

    describe('DELETE /user', () => {
        it('should delete the current user', async () => {
            const { statusCode, body } = await request(app).delete('/user')
                .set('Authorization', `Bearer ${userToken}`).send();

            expect(statusCode).toBe(200);
            expect(body.success).toBe(true);

            const { statusCode: loginCode } = await request(app).post('/login').send(user);
            expect(loginCode).toBe(401);
        });

        it('should NOT delete the user without a token', async () => {
            const { statusCode } = await request(app).delete('/user').send();

            expect(statusCode).toBe(401);
        });
    });
});