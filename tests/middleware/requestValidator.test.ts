import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequest, ValidationSource } from '../../src/middleware/requestValidator';

describe('Request Validator Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {
            body: {},
            query: {},
            params: {},
            headers: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        nextFunction = jest.fn();
    });

    describe('Body Validation', () => {
        const schema = z.object({
            username: z.string().min(3),
            email: z.string().email(),
            age: z.number().min(18)
        });

        it('should pass validation with valid body data', () => {
            mockRequest.body = {
                username: 'john_doe',
                email: 'john@example.com',
                age: 25
            };

            const validator = validateRequest(schema, ValidationSource.BODY);
            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should fail validation with invalid body data', () => {
            mockRequest.body = {
                username: 'jo',  // too short
                email: 'invalid-email',
                age: 16  // under minimum age
            };

            const validator = validateRequest(schema, ValidationSource.BODY);
            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.any(String)
                })
            );
        });
    });

    describe('Query Validation', () => {
        const schema = z.object({
            page: z.number().min(1).optional(),
            limit: z.number().min(1).max(100).optional()
        });        

        it('should fail validation with invalid query parameters', () => {
            mockRequest.query = {
                page: '0',
                limit: '200'
            };

            const validator = validateRequest(schema, ValidationSource.QUERY);
            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });

    describe('Params Validation', () => {
        const schema = z.object({
            id: z.string().uuid()
        });

        it('should pass validation with valid params', () => {
            mockRequest.params = {
                id: '123e4567-e89b-12d3-a456-426614174000'
            };

            const validator = validateRequest(schema, ValidationSource.PARAMS);
            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should fail validation with invalid params', () => {
            mockRequest.params = {
                id: 'invalid-uuid'
            };

            const validator = validateRequest(schema, ValidationSource.PARAMS);
            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });

    describe('Headers Validation', () => {
        const schema = z.object({
            'api-key': z.string().min(32)
        });

        it('should pass validation with valid headers', () => {
            mockRequest.headers = {
                'api-key': '12345678901234567890123456789012'
            };

            const validator = validateRequest(schema, ValidationSource.HEADERS);
            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should fail validation with invalid headers', () => {
            mockRequest.headers = {
                'api-key': 'short-key'
            };

            const validator = validateRequest(schema, ValidationSource.HEADERS);
            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });

    describe('Edge Cases', () => {
        const schema = z.object({
            field: z.string()
        });

        it('should handle empty data', () => {
            const validator = validateRequest(schema, ValidationSource.BODY);
            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should preserve original data after validation', () => {
            const originalData = {
                field: 'test-value',
                extraField: 'extra-value'
            };
            mockRequest.body = { ...originalData };

            const validator = validateRequest(schema, ValidationSource.BODY);
            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockRequest.body).toEqual(originalData);
        });
    });
});
