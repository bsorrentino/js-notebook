import React from "react";
import { useActions, useDispatch } from "../../hooks";
import { Cell, deleteCell } from "../../redux";
import TextEditor from "./TextEditor";

interface TextCellProps {
  cell: Cell;
}

const TextCell: React.FC<TextCellProps> = ({ cell }) => {
  const dispatch = useDispatch()
  const { moveCell } = useActions();

  return (
    <div className="text-cell">
      <TextEditor cell={cell} />
        <div className="action-bar">
          <button title="Move Up" onClick={() => moveCell({ id: cell.id, direction: "up" })}>
            <span className="material-icons">arrow_upward</span>
          </button>
          <button title="Move Down" onClick={() => moveCell({ id: cell.id, direction: "down" })}>
            <span className="material-icons">arrow_downward</span>
          </button>
          <button title="Delete Cell" onClick={() => dispatch( deleteCell({ id: cell.id }))}>
            <span className="material-icons">clear</span>
          </button>
        </div>
        </div>
      )
}

export default TextCell;
