"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installRaven = void 0;
var raven_1 = __importDefault(require("raven"));
var config_1 = __importDefault(require("./config"));
var logger_1 = require("./logger");
var logger = logger_1.createLogger();
function installRaven(_config) {
    if (_config === void 0) { _config = {}; }
    raven_1.default.config(config_1.default.sentryUrl, __assign({ extra: {
            level: config_1.default.logLevel
        } }, _config)).install();
    raven_1.default.install(function (err, sendErr, eventId) {
        if (!sendErr) {
            logger.error({
                err: err,
                eventId: eventId,
                scope: 'node-json-log.raven.sent-fatal'
            }, "Successfully sent fatal error with eventId " + eventId + " to Sentry:");
        }
        logger.error({
            err: err,
            scope: 'node-json-log.raven.failed-send'
        }, 'Sentry caught an unhandled error and it never made it to sentry :(');
        process.exit(1);
    });
    config_1.default.ravenWasInstalled = true;
}
exports.installRaven = installRaven;
