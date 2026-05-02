"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.setLoggerAuthToken = void 0;
let authToken = "";
const setLoggerAuthToken = (token) => {
    authToken = token;
};
exports.setLoggerAuthToken = setLoggerAuthToken;
const Log = async (stack, level, pkg, message) => {
    if (!authToken) {
        console.warn("Logger Middleware: No auth token set.");
        return;
    }
    try {
        const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ stack, level, package: pkg, message })
        });
        if (!response.ok) {
            console.error("Logger Failed. Status:", response.status);
        }
    }
    catch (error) {
        console.error("Logger Network Error:", error);
    }
};
exports.Log = Log;
