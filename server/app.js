import express, { urlencoded } from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";
dotenv.config();

const app= express();
// cors
// app.use(cors({
//     origin: process.env.CORS_ORIGIN
// }))
app.use(cors());

// body parse
app.use(express.json({limit: "50mb"}));

// routes
app.use("/api",userRouter);

// other routes
app.all("*", (req,res)=>{
    res.send(`Route ${req.originalUrl} not found`);
})

export default app;

