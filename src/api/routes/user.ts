import { Router } from 'express';
import passport from 'passport';
import { deleteUserById, updateUserById } from '../../db/services/user';
import User from '../../db/models/User';

const UserRouter = Router();
const authenticate = passport.authenticate('jwt', { session: false });

UserRouter.get('/', authenticate, (req, res) => res.json(req.user));

UserRouter.patch('/', authenticate, async (req, res, next) => {
    const user = req.user as User;
    try {
        const updatedUser = await updateUserById(user.id, req.body);
        return res.send(updatedUser.toJSON());
    } catch (e) {
        return next(e);
    }
});

UserRouter.delete('/', authenticate, async (req, res, next) => {
    const user = req.user as User;
    try {
        const success = await deleteUserById(user.id);
        return res.send({ success });
    } catch (e) {
        return next(e);
    }
});

export default UserRouter;