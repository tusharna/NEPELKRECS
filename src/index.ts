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


const app = express();
setupSwagger(app);
app.use(express.json());

app.use(userRouter);
app.use(playerRouter);
app.use(morganMiddleware);



const port = process.env.PORT || 3000;



app.get("/orders",(req: Request, res: Response) => {

    logger.info("Fetching orders examples");
    res.send("Hello World from orders");
});


app.get("/error", (req: Request, res: Response) => {
    throw new Error("Error fetching orders examples");
});

app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
