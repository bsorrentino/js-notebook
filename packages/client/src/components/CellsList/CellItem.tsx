import React from "react";
import TextCell from "../TextCell";
import CodeCell from "../CodeCell";
import { Cell, NotebookLanguage } from "@bsorrentino/jsnotebook-client-data";

interface CellItemProps {
  cell: Cell;
  language: NotebookLanguage;
}

const CellItem: React.FC<CellItemProps> = ({ cell, language }) => {
  return (
    <>
      {cell.type === "code" && (
        <div className="cell-list-item">
            <CodeCell cell={cell} language={language} />
        </div>
      )}
      {cell.type === "text" && (
        <div className="cell-list-item">
            <TextCell cell={cell} />
        </div>
      )}
    </>
  );
};
export default React.memo(CellItem);
