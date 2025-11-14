import jwt from 'jsonwebtoken';


const Auth=async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"unAuthorized to access the Route"});
    }

    try{
        const user=jwt.verify(token,"secret");
        req.user=user;
        next();
    }catch(err){
        return res.status(403).json({message:"invalid or expired token"});
    }
}

export default Auth;