import React, { useEffect } from "react";
import CellItem from "./CellItem";
import { useDispatch, useSelector } from "../../hooks";
import { fetchCells, saveCells } from "../../redux";
import AddCell from "../AddCell";

const CellsList: React.FC = () => {
  const dispatch = useDispatch();

  // fetch cells from file
  useEffect(() => {
    dispatch(fetchCells());
  }, []);

  // save cells to file every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(saveCells());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const { notebook, cellsData, order, hasTypescript } = useSelector(({ cells }) => {
    let { data, order, notebook } = cells;
    const cellsData = order.map((id) => data[id]);
    const hasTypescript =
      cellsData.filter((cell) => cell.language === "typescript").length > 0;
    return { notebook, cellsData, order, hasTypescript };
  });

  const cells = cellsData.map((cell) => {
    return (
      <div className="cells-list-item" key={cell.id}>
        <CellItem cell={cell} hasTypescript={hasTypescript} />
        <AddCell prevCellId={cell.id} />
      </div>
    );
  });

  return (
    <>
    <div className="box">
    <span className="tag is-info is-large">Notebook</span>
    <h1 className="title is-1">{notebook}</h1>
    </div>
    <div className="cells-list">
      {order.length === 0 && (
        <div className="visible">
          <AddCell prevCellId={null} />
        </div>
      )}
      {cells}
    </div>
    </>
  );
};

export default CellsList;
