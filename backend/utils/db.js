import mongoose from "mongoose";

export const DatabaseConnect=async()=>{ // named funtion export syntax
    try{
        if(!process.env.MONGO_URI){
            throw new Error("Error in URI by USER");
        }
        const connect=await mongoose.connect(process.env.MONGO_URI) // connect is the mongoose instance 
        console.log(`Connected to database ${connect.connection.name}`);
        console.log(`Connection Status ${connect.connection.readyState}`);
    }catch(err){
        console.log(`error on db Connection : ${err}`);
    }
};



