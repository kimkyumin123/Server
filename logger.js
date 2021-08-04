const RootPath = require('app-root-path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp,splat, label, printf ,errors } = format;
const winstonDaily = require('winston-daily-rotate-file')
//포맷형식
const myFormat = printf(({level,message,label,timestamp,stack})=>{
  if(stack){
    return `${timestamp} ${[label]} ${level}: ${message}\n${stack}`
  }else{
    return `${timestamp} ${[label]} ${level}: ${message}`
  }
})

const logger = createLogger({
  format:combine(
    errors({ stack: true }), // <-- use errors format
    label({label : 'test Logging'}),
    timestamp({
      format:'YYYY-MM-DD HH:mm:ss'
    }),
    myFormat
  ),
  transports: [
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: `${RootPath}/logs/`,
      filename: `%DATE%_info.log`,
      maxFiles: 30,  // 30일치 로그 파일 저장
      zippedArchive: true, 
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${RootPath}/logs/`,
      filename: `%DATE%_error.log`,
      maxFiles: 30,  // 30일치 로그 파일 저장
      zippedArchive: true, 
    }),
    new winstonDaily({
      level: 'http',
      datePattern: 'YYYY-MM-DD',
      dirname: `${RootPath}/logs/`,
      filename: `%DATE%_http.log`,
      maxFiles: 30,  // 30일치 로그 파일 저장
      zippedArchive: true,  //로그파일을 zip로 유지
    }),
    ],
    exceptionHandlers: [
      new winstonDaily({ 
        datePattern: 'YYYY-MM-DD',
        dirname: `${RootPath}/logs/`,
        filename: `%DATE%_exception.log`,
        maxFiles: 30,  // 30일치 로그 파일 저장
        zippedArchive: true,  //로그파일을 zip로 유지

      })
    ]
})

//HTTP 코드 저장
logger.stream = {
  write: function (message, encoding) {
    logger.http(message)
  }
}

if (process.env.NODE_ENV === 'test') {
  console.log("TestLOG")
  logger.add(new transports.Console({
    handleExceptions:true,
    format: format.combine(
      errors({ stack: true }), // <-- use errors format
      format.colorize(),  // 색깔 넣어서 출력
      format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
    )
  }));
}

module.exports = logger