'use strict';

const config = require('config');

const { Log } = require('../utils/connect');

const winstonDaily = require('winston-daily-rotate-file');
const { createLogger, Transport, transports, format } = require('winston');
const { combine, timestamp, colorize, printf, label } = format;

const log_dir = 'logs';

class CustomTransport extends Transport {
    constructor() {
        super(); // Transport 클래스의 생성자를 호출 - 부모 클래스의 속성과 메서드를 상속
    }

    log(info, callback) {
        const level = info.level;
        const method = info.message.split(' ')[0];
        const message = info.message.split(' ')[1].replace(/"/g, '');
        const status = parseInt(info.message.split(' ')[3]);
        const response_time = parseFloat(info.message.split(' ')[4]);

        if (!/^\/(js|css)/.test(message)) { // '/js' 또는 '/css'가 앞에 없는 경우
            Log.create({
                level: level,
                method: method,
                message: message,
                status: status,
                response_time: response_time,
            }).then(() => {
                console.log('Successfully inserted log into PostgreSQL');
                callback();
            });
        } else {
            callback();
        }
    }
}

// 사용자 지정 포맷
const print_format = printf(({ timestamp, label, level, message }) => {
    return `${timestamp} [${label}] ${level} : ${message}`;
});

const print_log_format = {
    default: combine(
        label({
            label: 'BOARD',
        }),

        timestamp({
            format: 'YYYY-MM-DD HH:mm:dd',
        }),
        print_format,
    ),
};

const logger = createLogger({
    format: print_log_format.default,
    transports: [
        // info 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: log_dir,
            filename: `%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        // warn 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'warn',
            datePattern: 'YYYY-MM-DD',
            dirname: log_dir + '/warn',
            filename: `%DATE%.warn.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        // error 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: log_dir + '/error',
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        new CustomTransport(),
    ],
});

//실제 서비스중인 서버가 아니면
if (config.get('server.state') !== 'production') {
    logger.add(
        new transports.Console({
            format: combine(colorize({ all: true }), print_format),
        }),
    );
}

logger.stream = {
    write: (message) => logger.info(message),
};

module.exports = logger;
