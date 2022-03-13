import React, { KeyboardEvent, useCallback, useRef } from "react";
import Preview from "./Preview";
import Resizable from "../Resizable";
import {
  Cell,
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
import * as classes from "./CodeCell.module.css";
import Editor, { OnMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";

type KeysPressed = Record<string, boolean>

interface CodeCellProps {
  cell: Cell;
  hasTypescript: boolean;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell, hasTypescript }) => {

  const dispatch = useDispatch();
  const cumulativeCode = useCumulativeCode(cell.id);
  const editorRef = useRef<any>()

  let keysPressed: KeysPressed = {};

  const handleSubmit = useCallback(() => {
    dispatch(
      createBundle({ id: cell.id, input: cumulativeCode, hasTypescript })
    )
  }, [ cell.id, cumulativeCode, hasTypescript ] )

  const handleKeyDown = (event: KeyboardEvent) => {
    keysPressed[event.key] = true;
    if (keysPressed["Control"] && keysPressed["Shift"]) {
      handleSubmit();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    delete keysPressed[event.key];
  };

  const handleEditorMount: OnMount = (monacoEditor, monaco) => {
    editorRef.current = monacoEditor;
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      // noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  };

  const handleFormatCode = useCallback( () => {
    if (!editorRef.current) return

    const unformatted = editorRef.current.getModel().getValue()
    const formatted = prettier.format(unformatted, {
      parser: "babel",
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: false,
    })
    editorRef.current?.setValue(formatted)
  }, [editorRef.current] )

  const handleChangeCode = (e: string | undefined) => {
    if (!e) return
    dispatch(updateCellContent({ id: cell.id, content: e }))
  }

  return (
    <div className="code-cell">

      <div className="action-bar-wrapper">
        <LanguageDropdown
          id={cell.id}
          initialLanguage={cell.language || "javascript"}
        />

        <div className="action-bar">
          <button title="Clear Code" onClick={() => editorRef.current?.setValue("")}>
            <span className="material-icons">clear_all</span>
          </button>
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

      <Resizable direction="vertical">
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        >
          <div className={classes.wrapper}>
            <Editor
              onChange={handleChangeCode}
              onMount={handleEditorMount}
              value={cell?.content}
              height="100%"
              language={cell.language ?? "javascript"}
              theme="vs-dark"
              options={{
                wordWrap: "on",
                minimap: { enabled: false },
                showUnused: false,
                folding: false,
                fontSize: 20,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
          <Preview id={cell.id} />
        </div>
      </Resizable>

    </div>
  );
};

export default CodeCell;
