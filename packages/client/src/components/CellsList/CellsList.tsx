import React, { useEffect } from "react";
import CellItem from "./CellItem";
import { useDispatch, useSelector } from "../../hooks";
import { fetchCells, exportNotebook } from "../../redux";
import AddCell from "../AddCell";
import * as db from '@bsorrentino/jsnotebook-client-data'

const CellsList: React.FC = () => {
  const dispatch = useDispatch();

  // fetch cells from file
  useEffect(() => {
    dispatch(fetchCells());
  }, []);

  // save cells to file every 1 minute
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dispatch(exportNotebook());
  //   }, 60000);

  //   return () => clearInterval(interval);
  // }, []);

  const { cellsData, order, hasTypescript } = useSelector(({ cells }) => {
    let { data, order } = cells;
    const cellsData = order.map((id) => data[id]);
    const hasTypescript =
      cellsData.filter((cell) => cell.language === "typescript").length > 0;
    return { cellsData, order, hasTypescript };
  });

  const { notebookId:notebook  } = db.context

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
    <div className="columns is-vcentered is-variable is-0">
      <div className="column is-2">
        <span className="tag is-info is-large">Notebook</span>
      </div>
      <div className="column is-9">
          <h1 className="title">{notebook}</h1>
      </div>
      <div className="column">
        <button className="button is-outlined" onClick={ () => dispatch(exportNotebook())}>Export</button>
      </div>
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
