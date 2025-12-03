import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    imageUrl: { type: String, required: true },
    imageId: { type: String, required: true },
    imageStorage: { type: String, default: 'local', enum: ['local', 'cloudinary'] },
  },
  { timestamps: true }
);

export default mongoose.model("product", productSchema);
