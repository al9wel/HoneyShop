import express from "express";
import { create, getAll, getOne, update, deleteProduct } from "../controller/productController.js";
import upload from "../middleware/upload.js";

const productRoute = express.Router();

// 'images' field accepts multiple files
productRoute.post("/create", upload.array('images', 6), create);
productRoute.get("/all", getAll);
productRoute.get("/one/:id", getOne);
productRoute.put("/update/:id", upload.array('images', 6), update);
productRoute.delete("/delete/:id", deleteProduct);

export default productRoute;
