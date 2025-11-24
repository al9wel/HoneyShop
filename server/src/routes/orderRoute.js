import express from "express";
import { create, getAll, getOne, update, deleteOrder } from "../controller/orderController.js";

const orderRoute = express.Router();

orderRoute.post("/create", create);
orderRoute.get("/all", getAll);
orderRoute.get("/one/:id", getOne);
orderRoute.put("/update/:id", update);
orderRoute.delete("/delete/:id", deleteOrder);

export default orderRoute;
