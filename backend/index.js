import express, { request, response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'
import mongoose from "mongoose";
import router from './routes/userRoute.js'
dotenv.config();
const PORT = process.env.PORT || 4000;
const MONGODBURL = process.env.MONGODBURL;
const app = express();
app.use(cors({ credentials: true, origin:true }));
app.use(express.json());
app.use(cookieParser())
app.get('/',(request,response)=>{
    response.send("This is the server of the Authentication System created by Rahul Kumar")
})

app.use('/api',router)

//MongoDB Connection
mongoose
  .connect(MONGODBURL)
  .then(() => {
    console.log("Successfully connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error:${error}`);
});