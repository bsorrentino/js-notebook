import React, { KeyboardEvent, useCallback, useRef, useState } from "react";
import Preview from "./Preview";

import {
  createBundle,
  updateCellContent,
  deleteCell,
  moveCell
} from "../../redux";
import {
  useCumulativeCode,
  useDispatch,
} from "../../hooks";
import LanguageDropdown from "../LanguageDropdown";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from 'monaco-editor'
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { Cell, NotebookLanguage } from "@bsorrentino/jsnotebook-client-data";
import { Resizable } from "re-resizable";
import { resizeCell } from "../../redux/slices/cellsThunks";
//import * as classes from "./CodeCell.module.css";


interface CodeCellProps {
  cell: Cell;
  language: NotebookLanguage
}

const monacoEditorOptions:monaco.editor.IStandaloneEditorConstructionOptions = {
  wordWrap: 'on',
  minimap: { enabled: false },
  showUnused: false,
  folding: false,
  fontSize: 14,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
}

const resizableStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
}

/**
 * CodeCell Widget
 * 
 */
const CodeCell: React.FC<CodeCellProps> = ({ cell, language }) => {
  
  const cellHeight = ( cell.height || 200 ) 

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const dispatch = useDispatch();
  const cumulativeCode = useCumulativeCode(cell.id);
  
  const handleSubmit = useCallback(() => {
    dispatch(
      createBundle({ id: cell.id, input: cumulativeCode, hasTypescript: language === 'typescript' })
    )
  }, [ cell.id, cumulativeCode, language ] )

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key, altKey, ctrlKey, code, shiftKey } = event 
    //console.log( 'handleKeyDown', key, altKey, ctrlKey, shiftKey, code )

    if( shiftKey && key==='Enter' ) handleSubmit();
  }

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
    
    // monaco.languages.typescript.typescriptDefaults.addExtraLib( )

  }

  const handleFormatCode = useCallback( () => {
    if (!editorRef.current ) return // GUARD

    const model = editorRef.current.getModel()
    if( model === null ) return // GUARD

    const unformatted = model.getValue()
    const formatted = prettier.format(unformatted, {
      parser: "babel",
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: false,
    })
    editorRef.current.setValue(formatted)
  }, [editorRef.current] )

  const handleChangeCode = (e: string | undefined) => {
    if (!e) return // GUARD
    dispatch(updateCellContent({ id: cell.id, content: e }))
  }

  return (
    <div className="box">

      <div className="columns" style={{ marginBottom: 0}}>

        <div className="column is-2">
          <LanguageDropdown
            id={cell.id}
            initialLanguage={language}
          />
        </div>
        <div className="column is-offset-8 is-4">

          {/*
          <button title="Clear Code" onClick={() => editorRef.current?.setValue("")}>
            <span className="material-icons">clear_all</span>
          </button>
          */}          
          <button title="Format Code" onClick={handleFormatCode}>
            <span className="material-icons">format_indent_increase</span>
          </button>
          <button title="Run Code" onClick={handleSubmit}>
            <span className="material-icons">play_circle</span>
          </button>
          <button title="Move Up" onClick={() => dispatch( moveCell({ id: cell.id, direction: "up" }))}>
            <span className="material-icons">arrow_upward</span>
          </button>
          <button title="Move Down" onClick={() => dispatch( moveCell({ id: cell.id, direction: "down" }))}>
            <span className="material-icons">arrow_downward</span>
          </button>
          <button title="Delete Cell" onClick={() => dispatch(deleteCell({ id: cell.id }))}>
            <span className="material-icons">clear</span>
          </button>
          
        </div>

      </div>

      <div onKeyDown={handleKeyDown} >
        <Resizable
          style={resizableStyle}
          defaultSize={{ width: "100%", height: cellHeight }}
          onResizeStop={(e, direction, ref, d) => {
            const newHeight = cellHeight + d.height
            dispatch( resizeCell( { id: cell.id, height: newHeight }))
              .then( () => console.log( 'height updated to: ', newHeight, 'from', cellHeight))
          }}
          >
            <Editor
              onChange={handleChangeCode}
              onMount={handleEditorMount}
              value={cell?.content}
              language={language}
              theme="vs-dark"
              options={monacoEditorOptions}
            /> 
          </Resizable>
        </div>

        <br/>
          
        <Preview id={cell.id} />

    </div>
  );
};

export default CodeCell;
