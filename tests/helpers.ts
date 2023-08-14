import { agent } from 'supertest';
import app from '../src';

export const request = agent(app);