const express = require("express");

const verifyAuthToken = require("./middleware/auth");
const userRouter = require("./routers/user");
import { Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./middleware/logger";


const app = express();

app.use(express.json());
app.use(userRouter);

const port = process.env.PORT || 3000;



app.get("/orders", verifyAuthToken, (req: Request, res: Response) => {    ;
    logger.info("Fetching orders");
    res.send("Hello World");
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
