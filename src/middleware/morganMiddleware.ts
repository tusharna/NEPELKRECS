const morgan = require('morgan');

import logger from "./logger";


const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

function messageHandler(message: string) {
    console.log(message.trim());
    logger.info("Request received", JSON.parse(message.trim()));
}

const morganMiddleware=morgan(morganFormat, {
    stream:{
        write:messageHandler
    }
})

export default morganMiddleware;