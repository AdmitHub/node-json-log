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
var bunyan_1 = __importDefault(require("bunyan"));
var config_1 = __importDefault(require("./config"));
var http_1 = require("http");
var parseCookies = function (headers) {
    try {
        return headers.cookie
            .split(';')
            .map(function (unsplit) { return unsplit.split('='); })
            .reduce(function (cookies, unparsed) {
            cookies[unparsed[0]] = unparsed[1];
            return cookies;
        }, {});
    }
    catch (e) {
        return "[parse error] " + e;
    }
};
module.exports = {
    request: function customReq(req) {
        var _a;
        var builtRequest = {
            protocol: req.secure ? 'HTTPS' : 'HTTP',
            hostname: req.host,
            port: req.connection.localPort,
            path: (req.originalUrl || req.url).split('?')[0],
            method: req.method,
            query: req.query,
            remote_ip: req.connection.remoteAddress,
            remote_port: req.connection.remotePort,
            user_agent: req.headers['user-agent'],
        };
        if (config_1.default.logCookies && req.headers.cookie) {
            builtRequest.cookies = parseCookies(req.headers);
        }
        if (config_1.default.logHeaders) {
            builtRequest.headers = __assign({}, req.headers);
            (_a = builtRequest.headers) === null || _a === void 0 ? true : delete _a.cookie;
        }
        if (config_1.default.logBody && req.body) {
            if (config_1.default.logBodyLimit === 0 ||
                JSON.stringify(req.body).length < config_1.default.logBodyLimit) {
                builtRequest.body = req.body;
            }
            else {
                builtRequest.body = '[truncated]';
            }
        }
        return builtRequest;
    },
    response: function customRes(res) {
        // request lib returns an http.IncomingMessage object for it's response
        // express returns an http.ServerResponse for it's response
        // This might also be the actual response data, in which case, just log it
        var data = {};
        if (res instanceof http_1.IncomingMessage) {
            // This is coming from request. There should potentially be an error in here
            // if (res.statusCode >= 400) {
            //  data.body = res.data || res.body
            // }
            data.status = res.statusCode;
            data.type = 'IncomingMessage';
        }
        else if (res instanceof http_1.ServerResponse) {
            if (config_1.default.logHeaders) {
                data.headers = res.getHeaders();
            }
            data.status = res.statusCode;
            data.type = 'ServerResponse';
        }
        else {
            data = __assign(__assign({}, data), { type: 'Object' });
        }
        return data;
    },
    level: function customLevel(level) {
        return bunyan_1.default.nameFromLevel[level];
    },
    error: bunyan_1.default.stdSerializers.err
};
