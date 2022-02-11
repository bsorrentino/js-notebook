import React from "react";
import { useDispatch } from "react-redux";
import { useActions } from "../../hooks";
import { deleteCell } from "../../redux";

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const dispatch = useDispatch()
  const { moveCell } = useActions();

  return (
    <div className="action-bar">
      <button onClick={() => moveCell({ id: id, direction: "up" })}>
        <span className="material-icons">arrow_upward</span>
      </button>
      <button onClick={() => moveCell({ id: id, direction: "down" })}>
        <span className="material-icons">arrow_downward</span>
      </button>
      <button onClick={() => dispatch( deleteCell({ id: id }))}>
        <span className="material-icons">clear</span>
      </button>
    </div>
  );
};

export default ActionBar;
