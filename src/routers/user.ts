const express=require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const router=express.Router();
import { Request, Response } from "express";

interface User {
    uid: string;
    pwd: string; // In real apps, this should be hashed!
}

const users: User[] = [
    { uid: "Tushar", pwd: "1234" },
    { uid: "Sneha", pwd: "4321" },
];

let refreshTokens: string[] = [];

router.get("/users", (req: Request, res: Response) => {
    res.send(users);
});

router.post("/users", async (req: Request, res: Response) => {
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

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { uid, pwd } = req.body;
        const user: User | undefined = users.find((user) => user.uid === uid);
        if (!user) {
            return res.status(401).send({ error: "User not found" });
        } else {
            if ((await bcrypt.compare(pwd, user.pwd))) {
                
                const token = mintAccessToken(user);                
                const refreshToken = jwt.sign({ uid: user.uid } , process.env.JWT_REFRESH_ACCESS_TOKEN_SECRET,{expiresIn: '1d'});
                refreshTokens.push(refreshToken);
                return res.status(200).send({ message: "Login successful" ,token:token,refreshToken:refreshToken});
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

router.post("/token", (req: Request, res: Response) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    console.log(refreshTokens);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.JWT_REFRESH_ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        const accessToken = mintAccessToken(user);
        res.send({ accessToken: accessToken });
    })
})

router.delete("/logout", (req: Request, res: Response) => {
    const refreshToken = req.body.token;    
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.sendStatus(204);    
})
function mintAccessToken(user: any) {
    const accessToken = jwt.sign({ uid: user.uid }, process.env.JWT_ACCESS_TOKEN_SECRET,{expiresIn: '30s'});
    return accessToken;
}   

module.exports = router