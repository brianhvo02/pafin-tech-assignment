import express, { Application, Request, Response } from 'express';
import { PORT } from './config';
import UserRouter from './api/routes/users';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', async (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Hello, world!' });
});

app.use(UserRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;