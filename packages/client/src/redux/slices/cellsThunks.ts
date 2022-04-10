import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  DeleteCell,
  InsertCell,
  UpdateNotebookLanguage,
  UpdateCellRequest,
  MoveCell,
  ImportNotebook,
  ResizeCell
} from "../payload-types";
import { makeDebounce } from '../../debounce'
import produce from "immer";

export interface NotebookState {
  loading: boolean;
  error: string | null;
  saveStatus: string | null;
  order: string[];
  cells: Record<string, Cell>
  language: NotebookLanguage
}
import { Cell, Notebook, NotebookLanguage } from "@bsorrentino/jsnotebook-client-data";
import * as db from '@bsorrentino/jsnotebook-client-data'
import { getLogger } from "@bsorrentino/jsnotebook-logger";


const logger = getLogger( 'cellsThunks' )

const generateId = () => 
  Math.random().toString(36).substr(2, 5);

const errorMessage = ( error:any ) => {
  const result = error.message ?? error 
  console.error( result )
  return result
}


const updateCellDebounce = makeDebounce(700)

/**
 * fetchCells
 */
export const fetchNotebook = createAsyncThunk<
  Notebook|undefined,
  undefined,
  { rejectValue: string; state: RootState }
>("notebook/fetchNotebook", async (_, { rejectWithValue }) => {

  try {
    const result =  await db.fetchNotebook();

    // if( result.length === 0 ) {
    //   await db.saveCells( initData )
    //   result = initData
    // }

    return result

  } catch (error: any) {
    rejectWithValue( errorMessage(error) )
  }

})
/**
 * importNotebook
 */
 export const importNotebook = createAsyncThunk<
 Notebook|undefined,
 ImportNotebook,
 { rejectValue: string; state: RootState }
>("notebook/import", async ( args, { rejectWithValue }) => {

 try {

  const result = await db.updateNotebook( args )
  logger.trace(`cell content updated!`, result)

  return args

} catch (error: any) {

  rejectWithValue(errorMessage(error));
  
}

})
/**
 * exportNotebook
 */
export const exportNotebook = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string; state: RootState }
>("notebbok/export", async (_, { getState, rejectWithValue }) => {

  const { databaseName, notebookId } = db.context
  if( !notebookId ) { // GUARD
    rejectWithValue( 'notebook id has not been specified in query parameter "?notebook=<id>"' )
    return 
  }

  const { cells: data, order, language } = getState().notebook;
  
  const payload:Notebook = {
    language: language,
    cells: order.map(id => data[id])
  }

  try {
    logger.debug( 'exporting notebook .... ')
    await fetch(`/cells/${databaseName}/${notebookId}`, { 
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(payload)
     });
     logger.debug( 'notebook exported!')
  } catch (error:any) {
    rejectWithValue(error.message);
  }

})
/**
 * 
 */
export const updateCellContent = createAsyncThunk<
  void,
  UpdateCellRequest,
  { rejectValue: string; state: RootState }
>("cells/updateCellContent", async (arg, { getState, rejectWithValue }) => {


  updateCellDebounce( async () => {
    const { id: cellId, content } = arg
    try {

      const result = await db.updateCellById( cellId, cell => cell.content = content )
      logger.trace(`cell content updated!`, result)
  
    } catch (error: any) {
 
      rejectWithValue(errorMessage(error));
      
    }
  
  })

})
/**
 * updateCellLanguage
 */
export const updateNotebookLanguage = createAsyncThunk<
  void,
  UpdateNotebookLanguage,
  { rejectValue: string; state: RootState }
>("notebook/updateCellLanguage", async (arg, { getState, rejectWithValue }) => {

  const { language } = arg

  try {

    const result = await db.updateNotebook( arg )
    logger.trace( () => `cell language updated to ${language}!`, result)

  } catch (error: any) {

    rejectWithValue(errorMessage(error));
    
  }

})
/**
 * insertCell
 */
export const insertCell = createAsyncThunk<
  { insertAt:number, newCell:Cell }|undefined,
  InsertCell,
  { rejectValue: string; state: RootState }
>("cells/insertCell", async (arg, { getState, rejectWithValue }) => {

  const { id, type } = arg

  const state = getState().notebook

  const cell_id = generateId()

  const cell:Cell  = {
    id: cell_id,
    content: "",
    type: type,
    height: 200
  }

  const index = (id) ? state.order.findIndex((i) => i === id) : 0
  
  try {

    const result = await db.insertCellAtIndex( index, cell)
    logger.trace( () => `cell ${cell.id} inserted at index ${index}!`, result)
    return { insertAt: index, newCell:cell }

  } catch (error: any) {

    rejectWithValue(errorMessage(error));

  }

})
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

    logger.trace( 'cell deleted!', result)

  } catch (error: any) {
    
    rejectWithValue(errorMessage(error));
  }

})
/**
 *  MoveCell
 */
 export const moveCell = createAsyncThunk<
 Array<string>,
 MoveCell,
 { rejectValue: string; state: RootState }
>("cells/moveCell", async (arg, { getState, rejectWithValue }) => {
  
  const { order, cells: data } = getState().notebook

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
      logger.trace(`cell order updated!`, result)
  
    } catch (error: any) {
  
      rejectWithValue(errorMessage(error));
      
    }
  
  })

 })
/**
 *  Resize Cell
 */
 export const resizeCell = createAsyncThunk<
 void,
 ResizeCell,
 { rejectValue: string; state: RootState }
>("cells/resizeCell", async (arg, { rejectWithValue }) => {
  
  updateCellDebounce( async () => {
    const { id: cellId, height } = arg
    try {

      const result = await db.updateCellById( cellId, cell => cell.height = height )
      logger.trace(`cell height updated!`, result)
  
    } catch (error: any) {
 
      rejectWithValue(errorMessage(error));
      
    }
  
  })
  
})



