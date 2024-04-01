import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const mongoUrl = process.env.MONGO_URL;

const dbConnection = async () => {
    await mongoose.connect(mongoUrl).then((data) => {
        console.log(`Database connected with ${data.connection.host}`);
    }).catch((error) => {
        console.log(`Database connection error :: ${error.message}`);
    })
}

export default dbConnection;