import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRouter from "./router/userRouter.js";
import requestRouter from "./router/requestRouter.js";
import dataRouter from "./router/dataRouter.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: "*"
})); 

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/user", userRouter);
app.use("/request", requestRouter);
app.use("/data", dataRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Listening to port", PORT);
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connected to DB!"))
    .catch((err) => console.log(err));
});