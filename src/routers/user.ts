const { PrismaClient } = require('@prisma/client');

const express = require("express");
const bcrypt = require("bcrypt");
import logger from "../middleware/logger";
require("dotenv").config();
const jwt = require("jsonwebtoken");
const router = express.Router();
import { Request, Response } from "express";


const prisma = new PrismaClient();

router.get("/users", async (req: Request, res: Response) => {
    logger.info('fetching users');
    const users = await prisma.user.findMany();
    res.send(users);
});

router.post("/users", async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedpwd = await bcrypt.hash(user.password, salt);

        const newUser = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedpwd,
            },
        });

        logger.debug("User added successfully");
        const users = await prisma.user.findMany();
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
        const { name, password, email } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(401).send({ error: "User not found" });
        } else {
            if ((await bcrypt.compare(password, user.password))) {

                const token = mintAccessToken(user);
                const refreshToken = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_REFRESH_ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                const updateRefreshToken = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        refreshToken: refreshToken
                    }
                });
                return res.status(200).send({ message: "Login successful", token: token, refreshToken: refreshToken });
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

router.post("/token", async (req: Request, res: Response) => {
    const refreshToken = req.body.token;
    const email = req.body.email;
    if (refreshToken == null) return res.sendStatus(401);

    if (!await isRefreshTokenVaild(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        const accessToken = mintAccessToken(user);
        res.send({ accessToken: accessToken });
    })
})

async function isRefreshTokenVaild(refreshToken: string) {
    const user = await prisma.user.findUnique({
        where: {
            refreshToken: refreshToken,
        },
    });
    if (!user) {
        return false;
    }
    return true;
}


router.delete("/logout", async (req: Request, res: Response) => {
    const email = req.body.email;
    await prisma.user.update({
        where: {
            email: email

        }, data: {
            refreshToken: null
        }
    })
    res.sendStatus(204);
})

function mintAccessToken(user: any) {
    const accessToken = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    return accessToken;
}

module.exports = router