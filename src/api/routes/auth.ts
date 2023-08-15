import { Router } from "express";
import { createUser, getUserByCredentials } from "../../db/services/user";
import { ValidationErrorItem } from "sequelize";
import { Unauthorized, UnprocessableContent } from "../errors";
import passport from "passport";
import { sign } from "jsonwebtoken";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { secretOrKey } from "../../config";

passport.use(
    new JWTStrategy(
        {
            secretOrKey,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (err) {
                done(err);
            }
        }
    )
);

const AuthRouter = Router();

AuthRouter.post('/signup', async (req, res, next) => {
    try {
        const user = await createUser(req.body);
        res.json(user.toJSON());
    } catch (e) {
        const { errors } = e as { errors: ValidationErrorItem[] };
        const formattedErrors = errors.map(err => 
            `${err.path} ${
                (() => {
                    switch (err.validatorKey) {
                        case 'is_null':
                            return 'is required';
                        case 'isEmail':
                            return `${err.value} is not an valid email`;
                        case 'len': 
                            return `${err.value} is either less than 6 or more than 255 characters`;
                        case 'not_unique':
                            return `${err.value} already has a user associated with it`;
                        default:
                            return 'has problems';
                    }
                })()
            }`
        );

        next(new UnprocessableContent(formattedErrors));
    }
});

AuthRouter.post('/login', async (req, res, next) => {
    const errors = [];
    if (!req.body.email)
        errors.push('No email provided');
    if (!req.body.password)
        errors.push('No password provided');

    if (errors.length)
        return next(new UnprocessableContent(errors));

    try {
        const user = await getUserByCredentials(req.body.email, req.body.password);
        const token = sign(user.toJSON(), secretOrKey, { expiresIn: '1h' });
        return res.json({ token });
    } catch(e) {
        return next(new Unauthorized([ 'Invalid credentials' ]));
    }
});

export default AuthRouter;