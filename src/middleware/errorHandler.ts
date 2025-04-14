import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack for debugging purposes

  // Set a default status code and error message
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  // Check if the error has a specific status code
  if (res.statusCode) {
    statusCode = res.statusCode;
  }

  // Check if the error has a specific message
  if (err.message) {
    errorMessage = err.message;
  }

  // Customize error handling based on error type (optional)
  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = 'Unauthorized';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = 'Validation Error';
    // You might want to include more details about validation errors here
  }

  // Send the error response
  res.status(statusCode).json({
    error: errorMessage,
  });
};