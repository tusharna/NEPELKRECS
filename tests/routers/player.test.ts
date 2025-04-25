import { Request, Response } from 'express';
import prisma from '../../src/lib/prisma';
import jwt from 'jsonwebtoken';
import express from 'express';
import request from 'supertest';

// Mock the dependencies
jest.mock('../../src/lib/prisma', () => ({
    players: {
        findMany: jest.fn()
    }
}));

jest.mock('../../src/middleware/logger', () => ({
    info: jest.fn()
}));

// Mock the auth middleware
jest.mock('../../src/middleware/auth', () => {
    return jest.fn((req, res, next) => {
        if (req.headers.authorization) {
            req.user = { id: 1 };
            next();
        } else {
            res.sendStatus(401);
        }
    });
});

describe('Player Router', () => {
    let app: express.Application;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create a new express application for each test
        app = express();
        app.use(express.json());
        app.use('/', require('../../src/routers/player'));
    });

    describe('GET /players', () => {
        const mockPlayers = [
            {
                id: 1,
                Name: 'Virat',
                Surname: 'Kohli',
                Country: 'India',
                DOB: '1988-11-05',
                Age: 35,
                Specialism: 'Batsman',
                Batting: 'Right Handed',
                Bowling: 'Right Arm',
                Team: 'RCB'
            },
            {
                id: 2,
                Name: 'Rohit',
                Surname: 'Sharma',
                Country: 'India',
                DOB: '1987-04-30',
                Age: 36,
                Specialism: 'Batsman',
                Batting: 'Right Handed',
                Bowling: 'Right Arm',
                Team: 'MI'
            }
        ];

        it('should return players when authenticated', async () => {
            // Mock prisma response
            (prisma.players.findMany as jest.Mock).mockResolvedValue(mockPlayers);

            const response = await request(app)
                .get('/players')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPlayers);
            expect(prisma.players.findMany).toHaveBeenCalledWith({
                take: 10,
                skip: 1,
                cursor: {
                    id: 30,
                },
                orderBy: {
                    id: 'asc',
                },
            });
        });

        it('should return 401 when no token is provided', async () => {
            const response = await request(app)
                .get('/players');

            expect(response.status).toBe(401);
            expect(prisma.players.findMany).not.toHaveBeenCalled();
        });

        it('should handle database errors gracefully', async () => {
            // Mock prisma to throw error
            (prisma.players.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/players')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(500);
        });

        it('should apply correct pagination parameters', async () => {
            // Mock prisma response
            (prisma.players.findMany as jest.Mock).mockResolvedValue(mockPlayers);

            await request(app)
                .get('/players')
                .set('Authorization', 'Bearer valid_token');

            expect(prisma.players.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    take: 10,
                    skip: 1,
                    cursor: {
                        id: 30
                    },
                    orderBy: {
                        id: 'asc'
                    }
                })
            );
        });

        it('should return empty array when no players found', async () => {
            // Mock prisma to return empty array
            (prisma.players.findMany as jest.Mock).mockResolvedValue([]);

            const response = await request(app)
                .get('/players')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});
