import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../src/middleware/errorHandler';
import logger from '../../src/middleware/logger';

// Mock the logger
jest.mock('../../src/middleware/logger', () => ({
    error: jest.fn()
}));

describe('Error Handler Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            statusCode: 500
        };
        jest.clearAllMocks();
    });

    it('should handle default internal server error', () => {
        const error = new Error('Something went wrong');
        
        errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(logger.error).toHaveBeenCalledWith(error.stack);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Something went wrong'
        });
    });

    it('should handle unauthorized error', () => {
        const error = new Error('Unauthorized access');
        error.name = 'UnauthorizedError';
        
        errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(logger.error).toHaveBeenCalledWith(error.stack);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Unauthorized'
        });
    });

    it('should handle validation error', () => {
        const error = new Error('Invalid input');
        error.name = 'ValidationError';
        
        errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(logger.error).toHaveBeenCalledWith(error.stack);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Validation Error'
        });
    });

    it('should use custom status code if set in response', () => {
        const error = new Error('Not Found');
        mockResponse.statusCode = 404;
        
        errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(logger.error).toHaveBeenCalledWith(error.stack);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Not Found'
        });
    });

    it('should use default message if error message is empty', () => {
        const error = new Error();
        
        errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(logger.error).toHaveBeenCalledWith(error.stack);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Internal Server Error'
        });
    });
});
