import { OnMount } from "@monaco-editor/react";
import { AutoTypings, LocalStorageCache, SourceResolver, UnpkgSourceResolver } from "monaco-editor-auto-typings";
import { useEffect, useRef } from "react";
import * as monaco from 'monaco-editor'
import { SHOW } from "../../embedded-code";
import { Cell } from "@bsorrentino/jsnotebook-client-data";
import { makeDebounceAsync } from "../../debounce";
import { useCumulativeCode } from "../../hooks";
import CodeCell from ".";

self.
// @ts-ignore
MonacoEnvironment = {
  baseUrl: '/local/monaco-editor/esm/vs/',
  getWorkerUrl: (moduleId: string, label: string) => {
    console.log('MonacoEnvironment', moduleId, label)
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

  public async resolvePackageJson(packageName: string, version?: string | undefined, subPath?: string | undefined): Promise<string | undefined> {
    try {
      const result = await this.unpkgResolver.resolvePackageJson(packageName, version, subPath)

      if (result && result.length > 0) return result

      return await this.resolveFile(
        // `/local/${packageName}${version ? `@${version}` : ''}${subPath ? `/${subPath}` : ''}/package.json`
        `/local/${packageName}${subPath ? `/${subPath}` : ''}/package.json`
      );

    }
    catch (e) {
      console.error('resolvePackageJson', e)

    }

  }

  public async resolveSourceFile(packageName: string, version: string | undefined, path: string): Promise<string | undefined> {
    try {
      const result = await this.unpkgResolver.resolveSourceFile(packageName, version, path)

      if (result && result.length > 0) return result

      return await this.resolveFile(
        // `/local/${packageName}${version ? `@${version}` : ''}/${path}`
        `/local/${packageName}/${path}`
      );

    }
    catch (e) {
      console.error('resolveSourceFile', e)
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

type AbortControllerHolder = { controller: AbortController|null }

/**
 * 
 * @param cell 
 * @returns 
 */
export function useMonacoEditor( cell:Cell ) {
  const abortController = useRef<AbortControllerHolder>({ controller:null })
  const autoTypingsRef  = useRef<AutoTypings>()
  const editorRef       = useRef<monaco.editor.IStandaloneCodeEditor>()

  const [cumulativeCode, prevContent] = useCumulativeCode(cell.id)
  
  useEffect(() => {
    if( abortController.current.controller !== null ) {
      abortController.current.controller.abort()
    }

    abortController.current.controller = new AbortController();

    fetchDTSdebounce( async () => {
       const dts = await fetchDTS( { 
                  cellId: cell.id, 
                  content: prevContent, 
                  signal:abortController.current.controller?.signal } )
       console.log( '\n\n', cell.id, '\n\n', dts, '\n\n',) 
       
       const uri = monaco.Uri.from(  { scheme:'memory', path: cell.id} )
       if( !monaco.editor.getModel(uri) ) {
          monaco.editor.createModel( dts, 'typescript', uri )
       }

    })
  
    return () => {
      abortController.current.controller?.abort()
      abortController.current.controller == null
    }
  }, [ prevContent ] )

  useEffect(() => {
    return () => { // dispose autoTypingsRef
      if (autoTypingsRef.current) {
        console.log('disposing autotypings')
        autoTypingsRef.current.dispose()
      }
    }
  }, [])


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

    monaco.languages.typescript.typescriptDefaults.addExtraLib(SHOW.declaration)

    // Initialize auto typing on monaco editor. Imports will now automatically be typed!
    autoTypingsRef.current = AutoTypings.create(monacoEditor, {
      sourceCache: new LocalStorageCache(), // Cache loaded sources in localStorage. May be omitted
      monaco: monaco,
      sourceResolver: new NotebookSourceResolver()
    });
  }

  return {
    editorRef,
    handleEditorMount,
    cumulativeCode
  }
}

/**
 * 
 */
const fetchDTSdebounce = makeDebounceAsync(1000)

/**
 * 
 * @param arg 
 * @returns 
 */
async function fetchDTS( arg:{ cellId: string, content:string, signal?: AbortSignal} ) {

  const { cellId, content, signal } = arg

  try {

    const res = await fetch(`/dts/${cellId}`, {
      signal: signal,
      method: 'POST',
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body: content
    });

    return res.text()

  }
  catch (e) {
    console.warn('error generating DTS', e)
    return ''
  }

}
