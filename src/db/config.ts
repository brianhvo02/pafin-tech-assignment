import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { isDevelopment } from '../config';

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

if (!dbName)
    throw new Error('No database name given');

if (!dbUser)
    throw new Error('No database user given');

const dbConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'postgres',
    logging: isDevelopment 
});

export default dbConnection;