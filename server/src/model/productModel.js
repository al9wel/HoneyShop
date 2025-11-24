import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
        },
        size: {
            type: Number,
        },
        image: {
            type: String,
        },
    },
);

export default mongoose.model("product", productSchema);
