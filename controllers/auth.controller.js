import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const error = new Error('All Fields are Required');
            error.statusCode = 400;
            throw error;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("User already exist!")
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPasswword = await bcrypt.hash(password, salt);

        const newUser = await User.create([
            { name, email, password: hashPasswword }
        ], { session });


        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User Created Successfully',
            data: {
                token,
                user: newUser[0]
            }
        })


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error('Password doesnt match');
            error.statusCode = 401;
            throw error
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        res.status(200).json({
            success: true,
            message: 'User Signed in Successfully',
            data: {
                token,
                user
            }
        },)
    } catch (error) {
        next(error)
    }
};


