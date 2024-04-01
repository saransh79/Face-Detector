import express, { urlencoded } from "express";
// import cors from "cors";
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app= express();
// cors
// app.use(cors({
//     origin: process.env.CORS_ORIGIN 
// }))
// app.use(cors());

// body parse
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })

// routes
app.use("/api",userRouter);

// other routes
// app.all("*", (req,res)=>{
//     res.send(`Route ${req.originalUrl} not found`);
// })

export default app;

