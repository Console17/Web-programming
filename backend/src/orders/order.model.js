import mongoose from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Refunded"],
    },
  },
  { _id: true },
);

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      default: [],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("order", orderSchema);
