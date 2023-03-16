"use strict";

//모듈
const express = require('express');
const app = express();
const { sequelize } = require('./src/utils/connect');

const bodyParser = require('body-parser');
const config = require('config');

//웹세팅
app.use(express.static('../FrontEnd/public'));
app.set("views", '../FrontEnd/views');
app.set("view engine", "ejs");

//라우팅
const apiRouter = require('./src/routes');

//웹세팅
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", apiRouter);

//연결
app.listen(config.get('server.port'), () => { // 서버 연결
    console.log(`Server Running on ${config.get('server.port')} Port!`);
});

sequelize.sync({ force: false })
    // force : true, alter : true (모델 테이블 재생성시 db반영)
    // force -> 기존 데이터 날아감, alter -> 유지하면서 업데이트
    .then(() => {
        console.log("Success connecting DB");
    })
    .catch((err) => {
        console.error(err);
    });