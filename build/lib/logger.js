"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.TracingLogger = void 0;
var config_1 = __importDefault(require("./config"));
var bunyan_1 = __importStar(require("bunyan"));
var os_1 = __importDefault(require("os"));
var Raven = __importStar(require("@sentry/node"));
var serializers_1 = __importDefault(require("./serializers"));
var TracingLogger = /** @class */ (function (_super) {
    __extends(TracingLogger, _super);
    function TracingLogger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TracingLogger.prototype.report = function (obj) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var data = obj;
        var exception;
        var toLog;
        var message;
        var sentryMsg;
        if (typeof data === 'string') {
            exception = new Error(data);
            toLog = { err: exception };
            message = data;
        }
        else if (data instanceof Error) {
            exception = data;
            toLog = { err: exception };
            message = exception.message;
        }
        else if (data && typeof data === 'object') {
            if (data.err instanceof Error || data.error instanceof Error) {
                exception = (data.err || data.error);
            }
            else {
                var error = (data.err || data.error || 'No error provided');
                exception = new Error(error);
            }
            toLog = __assign(__assign({}, data), { err: exception });
            message = exception.message;
        }
        else {
            exception = new Error('Unknown data type provided');
            toLog = { err: exception };
            message = 'Unknown data type provided';
        }
        if (config_1.default.ravenWasInstalled) {
            Raven.setTag('scope', toLog.scope);
            toLog.sentry_id = Raven.captureException(exception);
            sentryMsg = '[Logged to Sentry]';
        }
        else {
            toLog.sentry_id = null;
            sentryMsg = '[Skipped Sentry]';
        }
        if (message) {
            params = __spreadArray([message], params);
        }
        return this.scopedLogEmitter.apply(this, __spreadArray(__spreadArray([bunyan_1.ERROR, toLog], params), [sentryMsg]));
    };
    TracingLogger.prototype.trace = function (obj) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return this.scopedLogEmitter.apply(this, __spreadArray([bunyan_1.TRACE, obj], params));
    };
    TracingLogger.prototype.debug = function (obj) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return this.scopedLogEmitter.apply(this, __spreadArray([bunyan_1.DEBUG, obj], params));
    };
    TracingLogger.prototype.info = function (obj) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return this.scopedLogEmitter.apply(this, __spreadArray([bunyan_1.INFO, obj], params));
    };
    TracingLogger.prototype.warn = function (obj) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return this.scopedLogEmitter.apply(this, __spreadArray([bunyan_1.WARN, obj], params));
    };
    TracingLogger.prototype.error = function (obj) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return this.scopedLogEmitter.apply(this, __spreadArray([bunyan_1.ERROR, obj], params));
    };
    TracingLogger.prototype.fatal = function (obj) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return this.scopedLogEmitter.apply(this, __spreadArray([bunyan_1.FATAL, obj], params));
    };
    TracingLogger.prototype.scopedLogEmitter = function (logLevel, obj) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        var currentEnabledLevel = _super.prototype.level.call(this);
        var isLogInScope = this._isLogInScope(obj);
        var level = logLevel;
        if (isLogInScope && level < currentEnabledLevel) {
            level = currentEnabledLevel; // Forcibly promote to a higher log level we know will pass the level logic checks
        }
        var levelName = bunyan_1.nameFromLevel[level];
        _super.prototype[levelName].apply(this, __spreadArray([obj], params));
    };
    TracingLogger.prototype._isLogInScope = function (data) {
        if (typeof data !== 'object') {
            return false;
        }
        var tag = data.scope || '';
        return config_1.default.logScopes.some(function (scope) { return tag.includes(scope); });
    };
    return TracingLogger;
}(bunyan_1.default));
exports.TracingLogger = TracingLogger;
var createLogger = function (options) {
    if (options === void 0) { options = { name: '' }; }
    var streams = [
        {
            level: config_1.default.logLevel,
            stream: process.stdout
        }
    ];
    if (options.additionalStreams) {
        streams.push({
            level: config_1.default.logLevel,
            stream: options.additionalStreams
        });
    }
    var serializers = __assign(__assign({}, bunyan_1.stdSerializers), serializers_1.default);
    if (options.serializers) {
        serializers = __assign(__assign({}, serializers), options.serializers);
    }
    var defaultOptions = {
        level: config_1.default.logLevel,
        serializers: serializers,
        src: false,
        streams: streams,
        name: os_1.default.hostname().split('-cmd')[0]
    };
    return new TracingLogger(defaultOptions);
};
exports.createLogger = createLogger;
