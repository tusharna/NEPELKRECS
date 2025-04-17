import prisma from "../lib/prisma";
const express = require("express");
import logger from "../middleware/logger";
const verifyAuthToken = require("../middleware/auth");
const router = express.Router();
import { Request, Response } from "express";


/**
 * @swagger
 * /players:
 *   get:
 *     summary: Get all Players from IPL 2024
 *     tags:
 *       - Players
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: List of players
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   Name:
 *                     type: string
 *                     example: "Virat"
 *                   Surname:
 *                     type: string
 *                     example: "Kohli"
 *                   Country:
 *                     type: string
 *                     example: "Batsman"
 *                   DOB:
 *                     type: string
 *                     example: "1988-11-5"
 *                   Age:
 *                     type: number 
 *                     example: 18
 *                   Specialism:
 *                      type: string
 *                      example: "Batsman"
 *                   Batting:
 *                      type: string        
 *                      example: "Right Handed"                      
 *                   Bowling:
 *                      type: string
 *                      example: "Right Arm"
 *                   Team:
 *                       type: string
 *                       example: "RCB"                   
 */
router.get("/players", verifyAuthToken, async (req: Request, res: Response) => {
    const players = await prisma.players.findMany({
        take: 10,
        skip: 1,
        cursor: {
            id: 30,
        },
        orderBy: {
            id: 'asc',
        },
    });
    logger.info('fetching players');
    res.send(players);
}
);

module.exports = router