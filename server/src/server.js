import express from "express";
import { ENV } from "./lib/env.js";
const app = express()
app.listen(ENV.PORT, () => console.log("server is running in port : ", ENV.PORT))