import { OnMount } from "@monaco-editor/react";
import { AutoTypings, LocalStorageCache, SourceResolver, UnpkgSourceResolver } from "monaco-editor-auto-typings";
import { useEffect, useRef } from "react";
import * as monaco from 'monaco-editor'
import { SHOW } from "../../embedded-code";


self.
MonacoEnvironment = {
  baseUrl: '/local/monaco-editor/esm/vs/',
  getWorkerUrl: (moduleId:string, label:string) => {
    console.log( 'MonacoEnvironment', moduleId, label )
    if (label === 'json') {
      return './json.worker.js'
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './css.worker.js'
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './html.worker.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.js'
    }
    return './editor.worker.js'
  }
}

class NotebookSourceResolver implements SourceResolver {

    unpkgResolver = new UnpkgSourceResolver()
    
    public async resolvePackageJson(packageName: string, version?: string | undefined, subPath?: string | undefined):Promise<string | undefined> {
        try {
            const result =  await this.unpkgResolver.resolvePackageJson( packageName, version, subPath)

            if( result && result.length > 0 ) return result
            
            return await this.resolveFile(
                // `/local/${packageName}${version ? `@${version}` : ''}${subPath ? `/${subPath}` : ''}/package.json`
                `/local/${packageName}${subPath ? `/${subPath}` : ''}/package.json`
              );
    
        }
        catch( e ) {
          console.error( 'resolvePackageJson', e )

        }
        
    }

    public async resolveSourceFile(packageName: string, version: string | undefined, path: string):Promise<string | undefined> {
        try {
          const result =   await this.unpkgResolver.resolveSourceFile( packageName, version, path)

          if( result && result.length > 0 ) return result

          return await this.resolveFile(
                // `/local/${packageName}${version ? `@${version}` : ''}/${path}`
                `/local/${packageName}/${path}`
              );
    
        }
        catch( e ) {
            console.error( 'resolveSourceFile', e )
        }
    }

    private async resolveFile(url: string) {
        const res = await fetch(url, { method: 'GET' });
    
        if (res.ok) {
          return await res.text();
        } 
        
        throw Error(`Error '${res.status} while fetching from Unpkg at '${url}'`);
        
      }
}

export function useMonacoEditor( ) {
    const autoTypingsRef = useRef<AutoTypings>()

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
    
    useEffect( () => {

      return () => {

        if( autoTypingsRef.current ) {
          console.log( 'disposing autotypings')
          autoTypingsRef.current.dispose()
        }
      }
    }, [] )

    const handleEditorMount: OnMount = (monacoEditor, monaco) => {
        // console.log( 'handleEditorMount', monacoEditor, monaco )
        editorRef.current = monacoEditor
    
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2016,
          allowNonTsExtensions: true,
          moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          noEmit: true,
          typeRoots: ["node_modules/@types"]
        })
    
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: true,
        })
        
        monaco.languages.typescript.typescriptDefaults.addExtraLib( SHOW.declaration )
    
        // Initialize auto typing on monaco editor. Imports will now automatically be typed!
        autoTypingsRef.current = AutoTypings.create(monacoEditor, {
          sourceCache: new LocalStorageCache(), // Cache loaded sources in localStorage. May be omitted
          monaco: monaco,
          sourceResolver: new NotebookSourceResolver()
        });
      }
    
      return {
        editorRef,
        handleEditorMount
      }
}