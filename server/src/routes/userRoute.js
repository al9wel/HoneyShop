import express from "express"
import { login, register, deleteUser, getAll, getOne, update } from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/register", register)
userRoute.post("/login", login)
userRoute.get("/all", getAll)
userRoute.get("/one/:id", getOne)
userRoute.put("/update/:id", update)
userRoute.delete("/delete/:id", deleteUser)

export default userRoute;