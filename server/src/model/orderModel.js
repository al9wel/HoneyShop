import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    products: { type: [orderProductSchema], required: true },
    totalAmount: { type: Number, required: true },
    address: { type: String },
    paymentMethod: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("order", orderSchema);
