export enum LogLevel { 
    trace_native = 0, trace, debug_native, debug, info_native, info,  warning,  error 
}

export type LogFunc = ( ...data: any[] ) => any

export interface ILogger {
    trace(...data: any[]): void;
    trace( func:LogFunc, ...data: any[] ): void;

    debug(...data: any[]): void;
    debug( func:LogFunc, ...data: any[] ): void;

    info(...data: any[]): void;
    info(arg: LogFunc, ...data: any[]): void;

    warn(...data: any[]): void;
    warn( func: LogFunc, ...data: any[]): void;

    error(...data: any[]): void;
    error( func: LogFunc, ...data: any[]): void;
}

class Logger implements ILogger {

    constructor( public logLevel:LogLevel, private name:string  ) {}

    trace( ...data: any[] ):void {
        // console.log( `[${this.name}]`, 'trace', this.logLevel,  LogLevel.trace  )
        if( this.logLevel <= LogLevel.trace ) {
            const _l = ( this.logLevel === LogLevel.trace_native ) ? 
                        console.trace :
                        console.log
            if( typeof data[0] === 'function' ) {
                const f = data.shift() as Function
                return _l( `${this.name}:\n`, f(), ...data )
            }
            _l( `${this.name}:\n`, ...data ) 
        }
    }
    
    debug( ...data: any[] ):void {       
        if( this.logLevel <= LogLevel.debug ) {
            const _l = ( this.logLevel === LogLevel.debug_native ) ? 
                        console.debug :
                        console.log            
            if( typeof data[0] === 'function' ) {
                const f = data.shift() as Function
                return _l( `${this.name}:\n`,f(), ...data )
            }
            
            _l( `${this.name}:\n`, ...data ) 
        }
    }
    
    info( ...data: any[] ):void {
        if( this.logLevel <= LogLevel.info ) {
            const _l = ( this.logLevel === LogLevel.info_native ) ? 
                        console.info :
                        console.log            
            if( typeof data[0] === 'function' ) {
                const f = data.shift() as Function
                return _l( `${this.name}:\n`, f(), ...data ) 
            }
            _l( `${this.name}:\n`, ...data )
        }
    }
    
    warn( ...data: any[] ):void {
        if( this.logLevel <= LogLevel.warning ) {

            if( typeof data[0] === 'function' ) {
                const f = data.shift() as Function
                return  console.warn( this.name, f(), ...data )
            }
            console.warn( `${this.name}:\n`, ...data ) 
        }
    }
    
    error( ...data: any[] ):void {
        if( typeof data[0] === 'function' ) {
            const f = data.shift() as Function
            return console.error( this.name, f(), ...data )
        }
        console.error( `${this.name}:\n`, ...data ) 
    }
    
}

const _default = Symbol('default.logger')

type Loggers = Record<symbol|string,ILogger>

declare global {
    interface Window {
        loggers:Loggers
    }
  }

window.loggers = {}

window.loggers[_default] = new Logger(LogLevel.debug, '_default')

/**
 * 
 * @param initLoggers 
 */
export function initLoggers( defaultLevel:LogLevel, loggersInitializer: Array<{ name: string, level?:LogLevel }> ) {
    console.log( ">> initLoggers" )

    const defaultLogger = window.loggers[_default] as Logger
    defaultLogger.logLevel = defaultLevel

    loggersInitializer.forEach( l => {
        window.loggers[l.name.toLocaleLowerCase()] = new Logger( l.level ?? defaultLevel, l.name )
    })

    console.dir( window.loggers )
}

/**
 * 
 * @param name 
 * @returns 
 */
export const getLogger = ( name?: string ):ILogger => {
    // console.dir( window.loggers )

    const result =  ( name && window.loggers[name.toLocaleLowerCase()] ) ? 
                            window.loggers[name.toLocaleLowerCase()] :
                            window.loggers[_default]
                            
    // console.log( ">> GETLOGGER ", name )
    return result
}

