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
    return res.json({status:true ,message:"User Registered"})

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
    return res.json({ status:true,message: "Login Success" })
    // return res.json(token)

})

router.post('/forgot-password',async(req,res)=>{
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
            text: `http://localhost:3000/reset-password/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.json({message:'Unable to send email'})
            } else {
                return res.json({status:true,message:'Email Sent'})
            }
          });
    }catch(err){
        console.log(err)
    }
})
router.post('/reset-password/:token',async(req,res)=>{
    const {token}=req.params;
    const {password}=req.body;
    try{
        const decoded=await jwt.verify(token,process.env.SECRET);
        const id=decoded.id;
        const hashedPassword=await bcrypt.hash(password,10);
        await UserModel.findByIdAndUpdate({_id:id},{password:hashedPassword});
        return res.json({status:true, message:"Updated Password"});
    }catch(err){
        return res.json("Invalid Token");
    }
})
const verifyUser=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.json({status:false,message:"Invalid Token"})
        }
        const decoded= await jwt.verify(token,process.env.SECRET);
        // req.user=decoded;
        next()
    }catch(err){
        return res.json(err);
    }
}
router.get('/verify',verifyUser,async(req,res)=>{
    return res.json({Status:true,message: "Authorized"})
});
router.get('/logout',(req,res)=>{
    res.clearCookie('token')
    return res.json({status:true});
})

export default router