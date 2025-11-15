import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Link to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Array of items in the order
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        // Link to the specific product
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        // Store size/color selected if applicable
        size: { type: String }, 
        color: { type: String },
      },
    ],
    // Shipping address object
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    
    // NEW: Added a paymentMethod field
    paymentMethod: {
      type: String,
      required: true,
      default: 'Cash on Delivery', // Default to COD
    },

    // REMOVED: The paymentResult object has been removed

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
    // Order status
    // These fields are still useful for COD
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