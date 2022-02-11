import React from "react";
import * as classes from "./AddCell.module.css";
import { useDispatch } from "react-redux";
import { insertCell } from "../../redux";

interface AddCellProps {
  prevCellId: string | null;
}

const AddCell: React.FC<AddCellProps> = ({ prevCellId }) => {
  // const { insertCell } = useActions();
  const dispatch = useDispatch()
  return (
    <div className={classes["add-cell"]}>
      <div className={classes["add-buttons"]}>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => dispatch( insertCell({ id: prevCellId, type: "code" }))}
        >
          <span className="material-icons">add</span>
          <span>Code</span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => dispatch( insertCell({ id: prevCellId, type: "text" })) }
        >
          <span className="material-icons">add</span>
          <span>Text</span>
        </button>
      </div>
      <div className={classes["divider"]}></div>
    </div>
  );
};

export default AddCell;
