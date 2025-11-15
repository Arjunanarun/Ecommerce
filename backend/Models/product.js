import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
      },
    ],

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    discountPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "Discount price must be less than actual price",
      },
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // separate Category model recommended
      // required: true,
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    tags: [{ type: String, trim: true }],

    metadata: {
      weight: { type: Number }, // grams
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      material: { type: String },
      color: { type: String },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.model("Product", productSchema);
