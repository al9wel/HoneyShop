import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import userRoute from "./routes/userRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import productRoute from "./routes/productRoute.js"
import orderRoute from "./routes/orderRoute.js"

const app = express();
app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(() => {
    console.log("Database connected Successfully.")
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on port : ${PORT}`)
    })
}).catch(error => console.log(error));

app.use("/api/user", userRoute)
app.use("/api/category", categoryRoute)
app.use("/api/product", productRoute)
app.use("/api/order", orderRoute)
// serve uploads statically
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')))