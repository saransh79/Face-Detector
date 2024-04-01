import express, { urlencoded } from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";
dotenv.config();

const app= express();

// body parse
app.use(express.json({limit: "50mb"}));
// cors
app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

// routes
app.use("/api",userRouter);

// other routes
app.all("*", (req,res)=>{
    res.send(`Route ${req.originalUrl} not found`);
})

export default app;

