import dotenv from "dotenv";
import app from "./app.js";
import database from "./database/db.js";

dotenv.config();
// database connection
database();


const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})