import express from "express"
import { create, deleteCategory, getAll, update } from "../controller/categoryController.js";

const categoryRoute = express.Router();

categoryRoute.post("/create", create)
categoryRoute.get("/all", getAll)
categoryRoute.put("/update/:id", update)
categoryRoute.delete("/delete/:id", deleteCategory)

export default categoryRoute;