import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router();
import { UserModel } from '../Model/user.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const user = await UserModel.findOne({ email })
    if (user) {
        return res.json({ message: "User already exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,

    })
    await newUser.save();
    return res.json("User Registered")

})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
    if (!user) {
        return res.json({ message: "User not registered" })
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.json({ message: "Incorrect Password" })
    }
    const token = jwt.sign(
        { username: user.username },
        process.env.SECRET,
        { expiresIn: '1h' })
    res.cookie('token', token, { httpOnly: true, maxAge: 360000 })
    return res.json({ message: "Login Success" })
    // return res.json(token)

})

router.post('/forgot-password'),async(req,res)=>{
    const {email}=req.body;
    try{
        const user= await UserModel.findOne({email})
        if(!user){
            return res.json({message:"User not found"})
        }
        const token= jwt.sign({id:user._id},process.env.SECRET,{expiresIn:'5m'})
        var transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
            }
          });
          
          var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Link to reset your password',
            text: 'Please click on the link below to reset your password'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.json({message:'Unable to send email'})
            } else {
                return res.json({message:'Email Sent'})
            }
          });
    }catch(err){
        console.log(err)
    }
}
export default router