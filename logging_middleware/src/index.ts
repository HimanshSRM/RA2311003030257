export type LogStack = "backend" | "frontend";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

type BackendPackage = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service";
type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";
type SharedPackage = "auth" | "config" | "middleware" | "utils";

export type LogPackage = BackendPackage | FrontendPackage | SharedPackage;

let authToken = "";

export const setLoggerAuthToken = (token: string) => {
    authToken = token;
};

export const Log = async (stack: LogStack, level: LogLevel, pkg: LogPackage, message: string) => {
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
    } catch (error) {
        console.error("Logger Network Error:", error);
    }
};