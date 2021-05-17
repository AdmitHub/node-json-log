"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installRaven = void 0;
var node_1 = __importDefault(require("@sentry/node"));
var config_1 = __importDefault(require("./config"));
var logger_1 = require("./logger");
var logger = logger_1.createLogger();
function installRaven(_config) {
    if (_config === void 0) { _config = {}; }
    try {
        node_1.default.init(_config);
        logger.info({
            scope: 'node-json-log.raven.init-success'
        }, 'Sentry caught an unhandled error and it never made it to sentry :(');
    }
    catch (err) {
        logger.error({
            err: err,
            scope: 'node-json-log.raven.init-failed'
        }, 'Sentry caught an unhandled error and it never made it to sentry :(');
        process.exit(1);
    }
    config_1.default.ravenWasInstalled = true;
}
exports.installRaven = installRaven;
