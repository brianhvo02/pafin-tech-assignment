import express, { Application, NextFunction, Request, Response } from 'express';
import { PORT, isTesting } from './config';
import UserRouter from './api/routes/user';
import AuthRouter from './api/routes/auth';
import { ServerError } from './api/errors';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', async (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Hello, world!' });
});

app.use(AuthRouter);
app.use('/', UserRouter);

app.use((err: ServerError | Error, req: Request, res: Response, next: NextFunction) => {
    if ('statusCode' in err) {
        return res.status(err.statusCode).json({
            errors: err.errors
        });
    } else {
        next(err)
    }
});

if (!isTesting) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;