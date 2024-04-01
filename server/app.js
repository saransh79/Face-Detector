import express, { urlencoded } from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app= express();
// cors
// app.use(cors({
//     origin: process.env.CORS_ORIGIN 
// }))
app.use(cors());

// body parse
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes
app.use("/api",userRouter);

// other routes
app.all("*", (req,res)=>{
    res.send(`Route ${req.originalUrl} not found`);
})

export default app;

