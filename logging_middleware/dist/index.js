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
    // SMART ROUTING: Use proxy in browser to bypass CORS, direct IP in Node.js
    const isBrowser = typeof window !== "undefined";
    const targetUrl = isBrowser
        ? "/evaluation-service/logs"
        : "http://20.207.122.201/evaluation-service/logs";
    try {
        const response = await fetch(targetUrl, {
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
