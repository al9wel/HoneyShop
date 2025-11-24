import express from "express";
import { create, getAll, getOne, update, deleteProduct } from "../controller/productController.js";

const productRoute = express.Router();

productRoute.post("/create", create);
productRoute.get("/all", getAll);
productRoute.get("/one/:id", getOne);
productRoute.put("/update/:id", update);
productRoute.delete("/delete/:id", deleteProduct);

export default productRoute;
