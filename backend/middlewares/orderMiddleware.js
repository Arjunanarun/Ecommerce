import User from "../Models/user";
import jwt from 'jsonwebtoken';

const orderHandler=async(req,res,next)=>{
    const token=req.cookies.token;
    const{}
    if(token){
        try{
            const user=req.user;            
            const newOrder=new Order({
                user:user._id,
                orderItems=
                
            })
        }catch(err){

        }
    }
}