import { initLoggers, LogLevel } from "@bsorrentino/jsnotebook-logger";

initLoggers( LogLevel.info, [
{ name: 'monaco-editor-hook', level: LogLevel.info },
{ name: 'hooks', level: LogLevel.info },
])  
