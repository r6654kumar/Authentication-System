import express from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../Model/user.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({ status: true, message: "User Registered" });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not registered" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Incorrect Password" });
        }
        const token = jwt.sign(
            { username: user.username },
            process.env.SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        return res.status(200).json({ status: true, message: "Login Success" });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '5m' });
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Link to reset your password',
            text: `http://localhost:3000/reset-password/${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Unable to send email' });
            } else {
                return res.status(200).json({ status: true, message: 'Email Sent' });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const id = decoded.id;
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
        return res.status(200).json({ status: true, message: "Updated Password" });
    } catch (error) {
        return res.status(400).json({ message: "Invalid Token", error });
    }
});

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: "Invalid Token" });
        }
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error });
    }
};

router.get('/verify', verifyUser, async (req, res) => {
    return res.status(200).json({ status: true, message: "Authorized" });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ status: true, message: "Logged Out" });
});

export default router;
