const express = require("express");
const bcrypt = require("bcrypt");
const verifyAuthToken=require("./middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
app.use(express.json());

import { Request, Response } from "express";
interface User {
    uid: string;
    pwd: string; // In real apps, this should be hashed!
}

const users: User[] = [
    { uid: "Tushar", pwd: "1234" },
    { uid: "Sneha", pwd: "4321" },
];
app.get("/orders", verifyAuthToken,(req: Request, res: Response) => {
    console.log(req);
    res.send("Hello World");
});

app.get("/users", (req: Request, res: Response) => {
    res.send(users);
});

app.post("/users", async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedpwd = await bcrypt.hash(user.pwd, salt);
        const userhasedpassword: User = { uid: user.uid, pwd: hashedpwd };
        users.push(userhasedpassword);
        res.send(users);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ error: "An error occurred while processing your request." });
    }
});

app.post("/login", async (req: Request, res: Response) => {
    try {
        const { uid, pwd } = req.body;
        const user: User | undefined = users.find((user) => user.uid === uid);
        if (!user) {
            return res.status(401).send({ error: "User not found" });
        } else {
            if ((await bcrypt.compare(pwd, user.pwd))) {
                const token = jwt.sign({ uid }, process.env.JWT_ACCESS_TOKEN_SECRET);
                return res.status(200).send({ message: "Login successful" ,token:token});
            } else {
                return res.status(401).send({ error: "Invalid password" });
            }
        }
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ error: "An error occurred while processing your request." });
    }
});

app.listen(3006);
