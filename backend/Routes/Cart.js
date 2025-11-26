import mongoose from "mongoose";
import Cart from "../Models/cart";

const router=express.Router();

router.post('/',async(req,res)=>{
    const{items}=req.body;
    console.log("Cart items from frontend",items);
    const id=req.user._id;
    items.forEach(item => {
        console.log(`the product of cart named ${item.product} with quantity ${item.quantity} is in cart`);
    });
    // try{
    //     const exist=await Cart.findOne({user:id});
    //     if(!exist){
    //         Cart.create({
    //             user:id,
    //             cartItems:items,
    //         })
    //     }else{

    //     }
    // }catch(err){

    // }
})

export default router;