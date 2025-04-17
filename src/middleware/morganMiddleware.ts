const morgan = require('morgan');



import logger from './logger';

// Create a stream object with a 'write' function that uses Winston
const stream = {
    write: (message: string) => logger.info(message.trim()),
};

// Skip logging during tests or based on custom logic
const skip = () => {
    return process.env.NODE_ENV === 'test';
};

// Setup Morgan format + hook into Winston
const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream, skip }
);

export default morganMiddleware;