import mongoose from "mongoose";

const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        unique:true,
        required:true,
        ref:'User',
    },
    cartItems:[
        {
            productId:{
                type : mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
                min:1,
                default:1,
            }
        }
    ]
});

const Cart=mongoose.model('Cart',cartSchema);
export default  Cart;