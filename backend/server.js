import express from "express";
import dotenv from 'dotenv';
dotenv.config();  //load env file to use the values
const app=express();
import cors from 'cors';
import cookieParser from "cookie-parser";
import loginRoute from './Routes/Login.js';
import registerRoute from './Routes/Register.js';
import authRoute from './Routes/Auth.js';
import productRoute from './Routes/Product.js';
import {DatabaseConnect} from './utils/db.js'; //importing named funcitons should match exact name

const PORT=process.env.PORT || 5000;
DatabaseConnect(); // Establish Database Connection
app.use(express.json()) // for Parsing the Request and Response
app.use(cookieParser()) 
app.use(express.urlencoded({extended:true})); // for Reading data from url form
app.use(cors({
    origin: "http://localhost:5173", 
    credentials:true
})); //Cross Origin Resource sharing

//Routes for Different Funtions
app.use('/login',loginRoute);  
app.use('/register',registerRoute);
app.use('/auth',authRoute);
app.use('/product',productRoute);

app.post("/test", (req, res) => {
  console.log(req.body);
  res.json({ received: req.body });
});


app.listen(PORT,()=>{
    console.log(`server running at ${PORT}`);
})