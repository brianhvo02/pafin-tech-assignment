import { isProduction } from '../config';
import User from './models/User';

const dbInit = () => {
    User.sync({ alter: !isProduction });
}

export default dbInit;