import { createAsyncThunk } from "@reduxjs/toolkit";
import { Cell } from "../cell";
import { RootState } from "../store";
import * as db from '../db'

export const fetchCells = createAsyncThunk<
  Cell[],
  undefined,
  { rejectValue: string }
>("cells/fetchCells", async (_, thunkAPI) => {
  try {
    return await db.loadCells();
    
  } catch (error:any) {
    thunkAPI.rejectWithValue(error.message);
  }
  return [];
});

export const saveCells = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string; state: RootState }
>("cells/saveCells", async (_, { getState, rejectWithValue }) => {

  try {
    const result = await db.updateCells( getState().cells ) 

    console.log( 'cell saved!', result)
  
  } catch (error:any) {
    rejectWithValue(error.message);
  }
});
