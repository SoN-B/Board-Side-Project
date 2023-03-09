"use strict";

const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        // swaggerDefinition는 yaml 형식이나 json 형식을 받습니다. 
        info: {
            title: 'Test API',
            version: '1.0.0',
            description: 'Test API with express',
        },
        host: 'localhost:5000',
        basePath: '/'
    },
    apis: ['./src/controllers/*/route.js']
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};