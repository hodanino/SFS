import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { LoginUserDto } from '../dtos/LoginUserDto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterUserDto } from '../dtos/RegisterUserDto';

export const register = async (req: Request, res: Response): Promise<void> => {
    //TODO: add email and excelName check for uniquness 
    const registerDto = plainToInstance(RegisterUserDto, req.body); 
    const errors = await validate(registerDto);

    if (errors.length > 0) {
        res.status(400).json({
            message: 'Validation failed',
            errors: errors.map(err => ({
                field: err.property,
                messages: Object.values(err.constraints || {}),
            })),
        });
        return;
    }

    const { name, email, password, excelName, role, spreadsheetId } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: IUser = new User({ name, email, password: hashedPassword, excelName, role, spreadsheetId });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error creating user' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    console.log("inside login");
    const loginUserDto = plainToInstance(LoginUserDto, req.body);
    const errors = await validate(loginUserDto);

    if (errors.length > 0) {
        res.status(400).json({
            message: 'Validation failed',
            errors: errors.map(err => ({
                field: err.property,
                messages: Object.values(err.constraints || {}),
            })),
        });
        return;
    }
    
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        console.log("create an JWT");
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });
        res.status(200).json({ token, user });
    } catch (error) {
        console.log("error creating JWT");
        res.status(500).json({ error: 'Server error' });
    }
};
