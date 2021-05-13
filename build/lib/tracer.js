"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dd_trace_1 = __importDefault(require("dd-trace"));
dd_trace_1.default.init(); // initialized in a different file to avoid hoisting.
exports.default = dd_trace_1.default;
