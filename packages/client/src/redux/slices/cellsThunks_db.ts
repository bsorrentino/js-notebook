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
 * saveCells
 */
export const saveCells = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string; state: RootState }
>("cells/saveCells", async (_, { getState, rejectWithValue }) => {
  console.log('save cells invoked!')
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

