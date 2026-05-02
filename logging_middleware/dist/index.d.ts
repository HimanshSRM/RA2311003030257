export type LogStack = "backend" | "frontend";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
type BackendPackage = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service";
type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";
type SharedPackage = "auth" | "config" | "middleware" | "utils";
export type LogPackage = BackendPackage | FrontendPackage | SharedPackage;
export declare const setLoggerAuthToken: (token: string) => void;
export declare const Log: (stack: LogStack, level: LogLevel, pkg: LogPackage, message: string) => Promise<void>;
export {};
