
import { Monaco, OnMount } from "@monaco-editor/react";
import { AutoTypings, LocalStorageCache, SourceResolver, UnpkgSourceResolver } from "monaco-editor-auto-typings"

import { useEffect, useRef } from "react";
import * as monaco from 'monaco-editor'
import { SHOW } from "../../embedded-code";
import { makeDebounceAsync } from "../../debounce";
import { useCumulativeCode } from "../../hooks";

import { Cell, NotebookLanguage } from "@bsorrentino/jsnotebook-client-data";
import { getLogger } from '@bsorrentino/jsnotebook-logger'

const logger = getLogger( 'monaco-editor-hook' )

const TYPES_ROOT = 'node_modules/@types'

self.
// @ts-ignore
MonacoEnvironment = {
  baseUrl: '/local/monaco-editor/esm/vs/',
  getWorkerUrl: (moduleId: string, label: string) => {
    logger.debug('MonacoEnvironment', moduleId, label)
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

/**
 * 
 */
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
    catch (e:any) {
      logger.error('resolvePackageJson', e.message)

    }

  }

  /**
   * 
   * @param packageName 
   * @param version 
   * @param path 
   * @returns 
   */
  public async resolveSourceFile(packageName: string, version: string | undefined, path: string): Promise<string | undefined> {
    try {
      const result = await this.unpkgResolver.resolveSourceFile(packageName, version, path)

      if (result && result.length > 0) return result

      return await this.resolveFile(
        // `/local/${packageName}${version ? `@${version}` : ''}/${path}`
        `/local/${packageName}/${path}`
      );

    }
    catch (e:any) {
      logger.error('resolveSourceFile', e.message)
    }
  }

  /**
   * 
   * @param url 
   * @returns 
   */
  private async resolveFile(url: string) {
    const res = await fetch(url, { method: 'GET' });

    if (res.ok) {
      return await res.text();
    }

    throw Error(`Error '${res.status} while fetching from Unpkg at '${url}'`);

  }
}

type AbortControllerHolder = { controller: AbortController|null }

const setExtraLibs = async (prevContent:string, monaco: Monaco, cell: Cell, abortController: AbortController|null ) => {
  
  const extraLibs:Array<{
          content: string;
          filePath?: string;
        }> = [
          { content: SHOW.declaration }
        ]
  if( prevContent.trim().length > 0 ) { 

    const dts = await fetchDTS( { 
      cellId: cell.id, 
      content: prevContent, 
      signal:abortController?.signal } )

    if( dts ) {
      logger.trace( () => `setExtraLibs(${cell.id})\n${dts}` ) 

      extraLibs.push( 
        { 
          content: dts,
          filePath:  monaco.Uri.file(`/${TYPES_ROOT}/${cell.id}/index.d.ts`).toString(true)
        }
      )
      
    }
  }

  monaco.languages.typescript.typescriptDefaults.setExtraLibs( extraLibs )

}

/**
 * 
 * @param cell 
 * @returns 
 */
export function useMonacoEditor( cell:Cell ) {
  const abortController           = useRef<AbortControllerHolder>({ controller:null })
  const autoTypingRef             = useRef<AutoTypings>()
  const editorRef  = useRef<{ editor: monaco.editor.IStandaloneCodeEditor, monaco:Monaco}>()

  const [cumulativeCode, prevContent] = useCumulativeCode(cell.id)

  useEffect(() => {

    if( !editorRef.current ) return // GUARD
    if( prevContent.trim().length === 0 ) return // GUARD

    const { monaco } = editorRef.current

    fetchDTSdebounce( async () =>  {
      abortController.current.controller = new AbortController();
      await setExtraLibs( prevContent, monaco, cell, abortController.current.controller )
    })
  
    return () => { // abort request
      logger.trace( `abort request for: ${cell.id}`)
      abortController.current.controller?.abort()
      abortController.current.controller == null

    }
    
  }, [ prevContent, editorRef.current ] )

  const handleEditorMount: OnMount = (monacoEditor, monaco) => {
    // logger.log( 'handleEditorMount', monacoEditor, monaco )
    editorRef.current = { editor: monacoEditor, monaco: monaco }
   
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      allowNonTsExtensions: true,
      noEmit: true,
      // esModuleInterop: true,
      // allowJs: true,      
      experimentalDecorators: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      typeRoots: [TYPES_ROOT]
    })
    // monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: true
    })

    // monaco.languages.typescript.typescriptDefaults.addExtraLib(SHOW.declaration)
    setExtraLibs( prevContent, monaco, cell, null ).then( () => {
    
    })
        
    // Initialize auto typing on monaco editor. Imports will now automatically be typed!
     AutoTypings.create(monacoEditor, {
        fileRootPath: 'inmemory://model/',
        sourceCache: new LocalStorageCache(), // Cache loaded sources in localStorage. May be omitted
        monaco: monaco,
        sourceResolver: new NotebookSourceResolver()
     })
     .then( ref => autoTypingRef.current = ref )

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
    logger.debug( `fetchDTS(${cellId}) start .....`)
    const res = await fetch(`/dts/${cellId}`, {
      signal: signal,
      method: 'POST',
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body: content
    });

    logger.debug( `fetchDTS(${cellId}) status: ${res.status}`)

    if( res.status === 200 ) 
      return await res.text()

  }
  catch (e:any) {
    logger.warn('error generating DTS', e.message )
  }

}
