import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Configure environment
dotenv.config();

// Mock jwt module
jest.mock('jsonwebtoken');

// Import the middleware
const verifyAuthToken = require('../../src/middleware/auth');

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        // Reset mocks before each test
        mockRequest = {
            headers: {},
            user: undefined
        };
        mockResponse = {
            sendStatus: jest.fn()
        };
        nextFunction = jest.fn();
    });

    it('should return 401 if no token is provided', async () => {
        mockRequest.headers = {};
        
        await verifyAuthToken(mockRequest as Request, mockResponse as Response, nextFunction);
        
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', async () => {
        mockRequest.headers = {
            authorization: 'Bearer invalid_token'
        };

        (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        await verifyAuthToken(mockRequest as Request, mockResponse as Response, nextFunction);
        
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should call next() and set user if token is valid', async () => {
        const mockUser = { id: 1, username: 'testuser' };
        mockRequest.headers = {
            authorization: 'Bearer valid_token'
        };

        (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
            callback(null, mockUser);
        });

        await verifyAuthToken(mockRequest as Request, mockResponse as Response, nextFunction);
        
        expect(mockRequest.user).toEqual(mockUser);
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.sendStatus).not.toHaveBeenCalled();
    });

    it('should handle malformed authorization header', async () => {
        mockRequest.headers = {
            authorization: 'malformed_header'
        };

        await verifyAuthToken(mockRequest as Request, mockResponse as Response, nextFunction);
        
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
        expect(nextFunction).not.toHaveBeenCalled();
    });
});
