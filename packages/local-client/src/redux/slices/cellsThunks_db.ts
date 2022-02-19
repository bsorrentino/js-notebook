import { createAsyncThunk } from "@reduxjs/toolkit";
import { Cell } from "../cell";
import { RootState } from "../store";
import * as db from '../../db'
import {
  DeleteCell,
  InsertCell,
  UpdateCellLanguage,
  UpdateCellContent,
} from "../payload-types";
import { makeDebounce } from '../../debounce'

export interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  saveStatus: string | null;
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
  { rejectValue: string }
>("cells/fetchCells", async (_, thunkAPI) => {
  try {
    let result =  await db.loadCells();

    // if( result.length === 0 ) {
    //   await db.saveCells( initData )

    //   result = initData
    // }

    return result

  } catch (error: any) {
    thunkAPI.rejectWithValue( errorMessage(error) )
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
    const { id, content } = arg
    try {

      const result = await db.updateCellById( id, cell => cell.content = content )
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

  const { id, language } = arg

  try {

    const result = await db.updateCellById( id, cell => cell.language = language )
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
    console.log('cell inserted!', result)
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

