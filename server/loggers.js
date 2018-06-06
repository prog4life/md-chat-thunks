const winston = require('winston');
const expressWinston = require('express-winston');

const { config } = winston;
const level = process.env.LOG_LEVEL || 'debug';

// alternative config manners
// winston.add(winston.transports.File, { filename: 'winston.log' });
// winston.configure({
//   transports: [
//     new (winston.transports.File)({ filename: 'winston.log' }),
//     new (winston.transports.Console)(),
//   ],
// });

exports.logger = new (winston.Logger)({
  level,
  transports: [
    new (winston.transports.Console)({
      timestamp() {
        return (new Date()).toLocaleTimeString();
        // return (new Date()).toISOString();
      },
      formatter(options) {
        // - Return string will be passed to logger.
        // - Optionally, use options.colorize(options.level, <string>) to
        //   colorize output based on the log level.
        return `${options.timestamp()} ` +
          `${config.colorize(options.level, options.level.toUpperCase())} ` +
          `${options.message ? options.message : ''} ` +
          `${options.meta && Object.keys(options.meta).length
            ? `\n\t ${JSON.stringify(options.meta)}`
            : ''
          }`;
      },
    }),
    // new (winston.transports.File)({
    //   level: 'debug',
    //   filename: 'winston.log',
    //   handleExceptions: true,
    //   json: false,
    //   colorize: true,
    //   timestamp: true,
    //   prettyPrint: true,
    // }),
  ],
});

exports.requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
  // winstonInstance: logger // instead of "transports"
  // optional: control whether you want to log the meta data about the request
  // (default to true)                                                  CHANGED
  meta: false,
  // optional: customize the default logging message. E.g. "{{res.statusCode}}
  // {{req.method}} {{res.responseTime}}ms {{req.url}}"                 CHANGED
  // msg: 'HTTP {{req.method}} {{req.url}}',
  msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
  // Use the default Express/morgan request formatting. Enabling this will
  // override any msg if true. Will only output colors with colorize set to true
  expressFormat: false, //                                              CHANGED
  // Color the text and status code, using the Express/morgan color palette
  // (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  colorize: true,
  // optional: allows to skip some log messages based on request and/or response
  ignoreRoute: (req, res) => false,
  // If set to true will log sub 400 responses at info level, sub 500 responses
  // as warnings and 500+ responses as errors
  statusLevels: true, // or {}
});

// Error logger needs to be added AFTER the express router (app.router) and
// BEFORE any of your custom error handlers (express.handler)
exports.errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
});
