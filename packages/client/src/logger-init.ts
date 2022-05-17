import { initLoggers, LogLevel } from "@bsorrentino/jsnotebook-logger";

initLoggers( LogLevel.info, [
    { name: 'CodeCell',             level: LogLevel.info },
    { name: 'monaco-editor-hook',   level: LogLevel.info },
    { name: 'hooks',                level: LogLevel.info },
    { name: 'unpkg-path-plugin',    level: LogLevel.info }

])  
