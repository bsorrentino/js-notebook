import { KeyboardEvent, useCallback, useEffect, useLayoutEffect } from "react";
import Preview from "./Preview";

import {
  createBundle,
  updateCellContent,
  deleteCell,
  moveCell
} from "../../redux";
import {
  useDispatch,
} from "../../hooks";
import LanguageDropdown from "../LanguageDropdown";
import Editor from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { Cell, NotebookLanguage } from "@bsorrentino/jsnotebook-client-data";
import { Resizable } from "re-resizable";
import { resizeCell } from "../../redux/slices/cellsThunks";
import { useMonacoEditor } from './monaco-editor-hook'
import { getLogger } from "@bsorrentino/jsnotebook-logger";

const logger = getLogger( 'CodeCell' )

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
const CodeCell = ( props:CodeCellProps ) => {
  
  const { cell, language } = props 
  
  const cellHeight = ( cell.height || 200 ) 
  
  const dispatch = useDispatch();

  const { 
    editorRef, 
    handleEditorMount, 
    cumulativeCode 
  } = useMonacoEditor( cell )
  

  const handleSubmit = useCallback(() => {
    dispatch(
      createBundle({ 
        id:             cell.id, 
        input:          cumulativeCode, 
        hasTypescript:  language === 'typescript' 
      })
    )
  }, [ cell.id, cumulativeCode, language ] )

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key, altKey, ctrlKey, code, shiftKey } = event 
    //console.log( 'handleKeyDown', key, altKey, ctrlKey, shiftKey, code )

    if( shiftKey && key==='Enter' ) handleSubmit();
  }

  const handleFormatCode = useCallback( () => {
    if (!editorRef.current ) return // GUARD

    const { editor } = editorRef.current

    const model = editor.getModel()
    if( model === null ) return // GUARD

    const unformatted = model.getValue()
    const formatted = prettier.format(unformatted, {
      parser: "babel",
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: false,
    })
    editor.setValue(formatted)
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
              path={`inmemory://model/${cell.id}.tsx`}
            /> 
          </Resizable>
        </div>

        <br/>
          
        <Preview id={cell.id} />

    </div>
  );
};

export default CodeCell;
