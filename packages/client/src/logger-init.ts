import { initLoggers, LogLevel } from "@bsorrentino/jsnotebook-logger";

initLoggers( LogLevel.info, [
{ name: 'monaco-editor-hook', level: LogLevel.trace },
{ name: 'hooks', level: LogLevel.trace },
])  
