const express = require("express");

const verifyAuthToken = require("./middleware/auth");
const userRouter = require("./routers/user");
import { Request, Response } from "express";

const app = express();

app.use(express.json());
app.use(userRouter);

const port = process.env.PORT || 3000;



app.get("/orders", verifyAuthToken, (req: Request, res: Response) => {
    console.log(req);
    res.send("Hello World");
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
