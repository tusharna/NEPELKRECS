const express = require("express");

const verifyAuthToken = require("./middleware/auth");
const userRouter = require("./routers/user");
const playerRouter = require("./routers/player");
import { errorHandler } from "./middleware/errorHandler";
import { Request, Response } from "express";
require("dotenv").config();
import logger from "./middleware/logger";
import morganMiddleware from "./middleware/morganMiddleware";
import { setupSwagger } from "../swagger";
import helmet from "helmet";
const cors = require("cors");


const app = express();
const corseOptions ={
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

setupSwagger(app);
app.use(cors(corseOptions));
app.use(helmet());
app.use(express.json());

app.use(userRouter);
app.use(playerRouter);
app.use(morganMiddleware);



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
