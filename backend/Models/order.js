import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Link to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    orderId:{
      type:String,
      required:true,
      unique:true,
    },
    
    // Array of items in the order
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        quantity:{
                type:Number,
                required:true,
                min:1,
                default:1,
            },
        purchasePrice:{
          type:Number,
          required:true,
        }
      },
    ],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    
    paymentMethod: {
      type: String,
      enum:['COD','CARD','UPI'],
      required: true,
      default: 'COD', // Default to COD
    },


    // Prices
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
 
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;