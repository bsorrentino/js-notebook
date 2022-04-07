import path from "path";
import ts, { CancellationToken } from "typescript";


class MyCancellationToken implements CancellationToken {

  isCancellationRequested(): boolean {

    console.log( '\n\nisCancellationRequested\n\n' )
    return false
  }
  throwIfCancellationRequested(): void {

    //console.log( '\n\nthrowIfCancellationRequested\n\n' )
    //throw new Error("request cancelled.");
  }

}
/**
 * 
 * @link https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#getting-the-dts-from-a-javascript-file
 * @param options 
 * @param fileNames 
 */

export function generateDTS( fileName: string, options: ts.CompilerOptions|undefined): string|undefined {

  const compileOptions : ts.CompilerOptions = {
    ...options,
    declaration: true,
    emitDeclarationOnly: true
  }

  const createdFiles:Record<string,string> = {}

  const host = ts.createCompilerHost(compileOptions);
  host.writeFile = 
    (fileName: string, contents: string) => createdFiles[fileName] = contents

  const file = path.normalize( fileName )
  
  const program = ts.createProgram( [file], compileOptions, host );

  const emitResult = program.emit( undefined, undefined, new MyCancellationToken() )

  console.log( '\n\ncreatedFiles\n\n', createdFiles, '\n\n')

  if( !emitResult.emitSkipped ) {
    
    const outputPropName = path.join( path.dirname(file), path.basename(file).replace( /\.(js|ts)$/, '.d.ts') )

    console.log( outputPropName )
    
    return createdFiles[outputPropName]
  
  }

}
