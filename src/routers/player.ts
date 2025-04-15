import prisma from "../lib/prisma";
const express = require("express");
import logger from "../middleware/logger";
const router = express.Router();
import { Request, Response } from "express";




router.get("/players", async (req: Request, res: Response) => {
    const players = await prisma.players.findMany();
    logger.info('fetching players');
    res.send(players);
}
);

module.exports = router