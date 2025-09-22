import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import rateLimiter from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";
import {initDB} from "./config/db.js"
import transactionsRoute from "./routes/transactionsRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();


const app = express();

//middleware
app.use(cors());
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT;




app.use("/api/transactions", transactionsRoute);
app.use("/api/users", userRoute);

// Global error handler (should be last middleware)
app.use(errorHandler);


initDB().then(() =>{
    app.listen(PORT,()=>{
    console.log("Server is up and running",PORT);
});
});