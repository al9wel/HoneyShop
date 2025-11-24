import express from "express"
import { create, deleteCategory, getAll, update } from "../controller/categoryController.js";
import upload from "../middleware/upload.js";

const categoryRoute = express.Router();

categoryRoute.post("/create", upload.single('image'), create)
categoryRoute.get("/all", getAll)
categoryRoute.put("/update/:id", upload.single('image'), update)
categoryRoute.delete("/delete/:id", deleteCategory)

export default categoryRoute;