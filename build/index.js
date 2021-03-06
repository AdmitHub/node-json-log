"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var tracer_1 = __importDefault(require("./lib/tracer"));
var logger_1 = require("./lib/logger");
module.exports = {
    createLogger: logger_1.createLogger,
    tracer: tracer_1.default
};
