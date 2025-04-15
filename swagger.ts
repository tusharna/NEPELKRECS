

import swaggerJSDoc, { Options } from 'swagger-jsdoc';
    
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation using Swagger with TypeScript',
        },
        servers: [
            {
                url: 'http://localhost:3006', // Adjust as needed
            },
        ],
    },
    apis: ['./src/routers/**/*.ts'], // Adjust path to your routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};