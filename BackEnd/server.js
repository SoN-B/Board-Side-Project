'use strict';

// 모듈
const express = require('express');
const app = express();

const { sequelize } = require('./src/utils/connect');

const morgan = require('morgan'); // log
const logger = require('./src/functions/winston');

app.use(morgan(':method ":url HTTP/:http-version" :status :response-time ms', { stream: logger.stream }));

const bodyParser = require('body-parser');
const config = require('config');

const methodOverride = require("method-override");

// 웹 세팅
app.use(express.static('../FrontEnd/public'));
app.set('views', '../FrontEnd/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

// 라우팅
const apiRouter = require('./src/routes');

app.use('/', apiRouter);

// 연결
app.listen(config.get('server.port'), () => {
    console.log(`Server Running On ${config.get('server.port')} Port!`);
});

sequelize.sync({ force: false })
    .then(() => { console.log('Success Connecting DB!'); })
    .catch((err) => { console.error(err); });
