import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Cell } from "@bsorrentino/jsnotebook-client-data";
import * as db from '@bsorrentino/jsnotebook-client-data'
import {
  DeleteCell,
  InsertCell,
  UpdateCellLanguage,
  UpdateCellContent,
  MoveCell,
  ImportNotebook
} from "../payload-types";
import { makeDebounce } from '../../debounce'
import produce from "immer";

export interface CellsState {
  loading: boolean;
  error: string | null;
  saveStatus: string | null;
  order: string[];
  data: Record<string, Cell>

}

const generateId = () => {
  return Math.random().toString(36).substr(2, 5);
};

const errorMessage = ( error:any ) => {
  const result = error.message ?? error 
  console.error( result )
  return result
}

/**
 * fetchCells
 */
export const fetchCells = createAsyncThunk<
  Cell[],
  undefined,
  { rejectValue: string; state: RootState }
>("cells/fetchCells", async (_, { getState, rejectWithValue }) => {

  try {
    let result =  await db.loadCells();

    // if( result.length === 0 ) {
    //   await db.saveCells( initData )
    //   result = initData
    // }

    return result

  } catch (error: any) {
    rejectWithValue( errorMessage(error) )
  }
  return [];
});

/**
 * importNotebook
 */
 export const importNotebook = createAsyncThunk<
 Array<Cell>,
 ImportNotebook,
 { rejectValue: string; state: RootState }
>("cells/import", async ( args, { rejectWithValue }) => {

 const { cells } = args

 try {

  const result = await db.saveCells( cells )
  console.log(`cell content updated!`, result)

  return cells

} catch (error: any) {

  rejectWithValue(errorMessage(error));
  return []
  
}

});

/**
 * exportNotebook
 */
export const exportNotebook = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string; state: RootState }
>("cells/export", async (_, { getState, rejectWithValue }) => {

  const { databaseName, notebookId } = db.context
  if( !notebookId ) { // GUARD
    rejectWithValue( 'notebook id has not been specified in query parameter "?notebook=<id>"' )
    return 
  }

  const { data, order } = getState().cells;
  
  const cells = order.map(id => data[id]);

  try {
    console.log( 'exporting notebook .... ')
    await fetch(`/cells/${databaseName}/${notebookId}`, { 
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(cells)
     });
     console.log( 'notebook exported!')
  } catch (error:any) {
    rejectWithValue(error.message);
  }


});

const updateCellContentDebounce = makeDebounce(700)

/**
 * 
 */
export const updateCellContent = createAsyncThunk<
  void,
  UpdateCellContent,
  { rejectValue: string; state: RootState }
>("cells/updateCellContent", async (arg, { getState, rejectWithValue }) => {


  updateCellContentDebounce( async () => {
    const { id: cellId, content } = arg
    try {

      const result = await db.updateCellById( cellId, cell => cell.content = content )
      console.log(`cell content updated!`, result)
  
    } catch (error: any) {
 
      rejectWithValue(errorMessage(error));
      
    }
  
  })

});

/**
 * updateCellLanguage
 */
export const updateCellLanguage = createAsyncThunk<
  void,
  UpdateCellLanguage,
  { rejectValue: string; state: RootState }
>("cells/updateCellLanguage", async (arg, { getState, rejectWithValue }) => {

  const { id: cellId, language } = arg

  try {

    const result = await db.updateCellById( cellId, cell => cell.language = language )
    console.log(`cell language updated to ${language}!`, result)

  } catch (error: any) {

    rejectWithValue(errorMessage(error));
    
  }

});

/**
 * insertCell
 */
export const insertCell = createAsyncThunk<
  { insertAt:number, newCell:Cell }|undefined,
  InsertCell,
  { rejectValue: string; state: RootState }
>("cells/insertCell", async (arg, { getState, rejectWithValue }) => {

  const { id, type } = arg

  const state = getState().cells

  const cell_id = generateId()

  const cell:Cell  = {
    id: cell_id,
    content: "",
    type: type,
    language: "javascript",
  }

  const index = (id) ? state.order.findIndex((i) => i === id) : 0
  
  try {

    const result = await db.insertCellAtIndex( index, cell)
    console.log(`cell ${cell.id} inserted at index ${index}!`, result)
    return { insertAt: index, newCell:cell }

  } catch (error: any) {

    rejectWithValue(errorMessage(error));

  }

});

/**
 * deleteCell
 */
export const deleteCell = createAsyncThunk<
  void,
  DeleteCell,
  { rejectValue: string; state: RootState }
>("cells/deleteCell", async (arg, { getState, rejectWithValue }) => {

  const { id } = arg

  try {

    const result = await db.deleteCellById( id )

    console.log('cell deleted!', result)

  } catch (error: any) {
    
    rejectWithValue(errorMessage(error));
  }

});


/**
 *  MoveCell
 */
 export const moveCell = createAsyncThunk<
 Array<string>,
 MoveCell,
 { rejectValue: string; state: RootState }
>("cells/moveCell", async (arg, { getState, rejectWithValue }) => {
  
  const { order, data } = getState().cells

  return await produce( 
    order
  ,async  draft => {
    
    const { id, direction } = arg

    const index = draft.findIndex((i) => i === id);

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    // guard: invalid moving direction
    if (targetIndex < 0 || targetIndex > draft.length - 1) {
      return 
    }

    draft[index] = order[targetIndex];
    draft[targetIndex] = id;

    try {

      const result = await db.saveCells( draft.map( id => data[id] ) )
      console.log(`cell order updated!`, result)
  
    } catch (error: any) {
  
      rejectWithValue(errorMessage(error));
      
    }
  
  })

 })

