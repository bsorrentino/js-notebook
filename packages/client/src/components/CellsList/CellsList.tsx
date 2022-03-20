import React, { useEffect, useRef } from "react";
import CellItem from "./CellItem";
import { useDispatch, useSelector } from "../../hooks";
import { fetchCells } from "../../redux";
import AddCell from "../AddCell";
import * as db from '@bsorrentino/jsnotebook-client-data'
import { ImportNotebook } from "../ImportNotebook/ImportNotebook";
import { ExportNotebook } from "../ExportNotebook/ExportNotebook";
// import {shallowEqual } from 'react-redux'

const CellsList: React.FC = () => {

  const dispatch = useDispatch()

  // fetch cells from file
  useEffect(() => { dispatch(fetchCells()) }, [])
  
    const { cellsData, order, hasTypescript, saveStatus } = useSelector(({ cells }) => {
    const { data, order, saveStatus } = cells;

    console.log( 'useSelector', saveStatus )

    let hasTypescript = false

    const cellsData = order.map(id => {
      hasTypescript = data[id].language === 'typescript'
      return data[id]
    })
    
    return { cellsData, order, hasTypescript, saveStatus };
  } )

  const { notebookId:notebook } = db.context

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
      <div className="column is-8">
          <h1 className="title">{notebook}</h1>
      </div>
      <div className="column">
        <ExportNotebook saveStatus={saveStatus}/>
      </div>
      <div className="column">
        <ImportNotebook/>
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
