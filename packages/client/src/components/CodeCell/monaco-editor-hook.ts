import { OnMount } from "@monaco-editor/react";
import { AutoTypings, LocalStorageCache, SourceResolver, UnpkgSourceResolver } from "monaco-editor-auto-typings";
import { useEffect, useRef } from "react";
import * as monaco from 'monaco-editor'
import { SHOW } from "../../embedded-code";
import { Cell } from "@bsorrentino/jsnotebook-client-data";

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
 * React hook
 * 
 * @param content 
 * @returns 
 */
export function useMonacoEditor( cell:Cell ) {
  const abortController = useRef<AbortControllerHolder>({ controller:null })
  const autoTypingsRef  = useRef<AutoTypings>()
  const editorRef       = useRef<monaco.editor.IStandaloneCodeEditor>()

  useEffect(() => {

    if( abortController.current.controller !== null ) {
      abortController.current.controller.abort()
    }

    abortController.current.controller = new AbortController();

    (async () => {

      const dts = await fetchDTS( cell, abortController.current.controller?.signal )
      console.log( dts )

    })();
  
    return () => {
      abortController.current.controller?.abort()
      abortController.current.controller == null
    }
  }, [ cell.content ] )


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
    handleEditorMount
  }
}


/**
 * 
 * @param cell 
 * @returns 
 */
async function fetchDTS(cell: Cell, signal?: AbortSignal) {

  if (cell.type !== 'code') return '' // GUARD

  const { id: cellId, content } = cell

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
