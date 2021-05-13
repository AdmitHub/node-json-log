"use strict";
require("./lib/tracer");
var logger_1 = require("./lib/logger");
var raven_initializer_1 = require("./lib/raven-initializer");
module.exports = {
    log: logger_1.createLogger(),
    createLogger: logger_1.createLogger,
    installLogger: function (config) {
        raven_initializer_1.installRaven(config);
    }
};
