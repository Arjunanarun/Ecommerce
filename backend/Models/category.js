import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // null → top-level category
    },

    image: {
      url: { type: String },
      alt: { type: String },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // SEO fields
    metaTitle: {
      type: String,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      maxlength: 160,
    },
    keywords: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);
