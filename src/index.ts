const express = require("express");

const verifyAuthToken = require("./middleware/auth");
const userRouter = require("./routers/user");
import { errorHandler } from "./middleware/errorHandler";
import { Request, Response } from "express";
require("dotenv").config();
import logger from "./middleware/logger";


const app = express();

app.use(express.json());

app.use(userRouter);



const port = process.env.PORT || 3000;



app.get("/orders", verifyAuthToken, (req: Request, res: Response) => {

    logger.info("Fetching orders");
    res.send("Hello World");
});


app.get("/error", (req: Request, res: Response) => {
    throw new Error("Error fetching orders");
});

app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
