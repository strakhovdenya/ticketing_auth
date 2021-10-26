import express, {Request, Response} from "express";
import {body} from "express-validator";
import {validateRequest, BadRequestError} from "@strtickets/common";
import {User} from "../models/user";
import {Password} from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage('Email mast be valid!'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password mast be exists')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email});

        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

       const passwordMatch = await Password.compare(existingUser.password, password);

        if(!passwordMatch){
            throw new BadRequestError('Invalid credentials');
        }

        //generate jwt
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email
            },
            process.env.JWT_KEY!
        );

        req.session = {jwt: userJwt};

        res.status(200).send(existingUser);
    })

export {router as signinRouter};