"use strict";
var dotenv_1 = require("dotenv");
dotenv_1.config();
function parseBool(value, _default) {
    if (value === 'true') {
        return true;
    }
    else if (value === 'false') {
        return false;
    }
    else {
        return _default;
    }
}
function parseInteger(value, _default) {
    if (!value) {
        return _default;
    }
    var parsedNumber = parseInt(value, 10);
    if (isNaN(parsedNumber)) {
        return _default;
    }
    return parsedNumber;
}
function parseArray(value) {
    if (!value) {
        return [];
    }
    return value.split(',').map(function (x) { return x.trim(); });
}
module.exports = {
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    logScopes: parseArray(process.env.LOG_SCOPES),
    logHeaders: parseBool(process.env.LOG_HEADERS, process.env.NODE_ENV !== 'production'),
    logBody: parseBool(process.env.LOG_REQUEST_BODY, process.env.NODE_ENV !== 'production'),
    logBodyLimit: parseInteger(process.env.LOG_REQUEST_BODY_LIMIT, 2048),
    logCookies: parseBool(process.env.LOG_REQUEST_COOKIES, process.env.NODE_ENV !== 'production'),
    sentryUrl: process.env.SENTRY_URL,
    ravenWasInstalled: true,
    tracingEnabled: parseBool(process.env.DD_LOGS_INJECTION, true),
};
