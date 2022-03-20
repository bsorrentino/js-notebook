import React from "react";
import TextCell from "../TextCell";
import CodeCell from "../CodeCell";
import { Cell } from "@bsorrentino/jsnotebook-client-data";

interface CellItemProps {
  cell: Cell;
  hasTypescript: boolean;
}

const CellItem: React.FC<CellItemProps> = ({ cell, hasTypescript }) => {
  return (
    <>
      {cell.type === "code" && (
        <div className="cell-list-item">
            <CodeCell cell={cell} hasTypescript={hasTypescript} />
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
