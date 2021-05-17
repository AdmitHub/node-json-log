"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installRaven = void 0;
var Raven = __importStar(require("@sentry/node"));
var config_1 = __importDefault(require("./config"));
var logger_1 = require("./logger");
var logger = logger_1.createLogger();
function installRaven(_config) {
    if (_config === void 0) { _config = {}; }
    try {
        Raven.init(_config);
        logger.info({
            scope: 'node-json-log.raven.init-success'
        }, 'Sentry init successful');
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
