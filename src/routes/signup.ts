import express, {Response, Request} from "express";
import {body} from "express-validator";
import {User} from "../models/user";
import {validateRequest, BadRequestError} from "@strtickets/common";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signup', [
        body('email')
            .isEmail()
            .withMessage('Email mast be valid'),
        body('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage('Password mast be between 4 and 20 characters')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
            throw new BadRequestError('Email already in use')
        }

        const user = User.build({email, password});
        await user.save();

        //generate jwt
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_KEY!
        );

        req.session = {jwt: userJwt};

        res.status(201).send(user);

    })

export {router as signupRouter};