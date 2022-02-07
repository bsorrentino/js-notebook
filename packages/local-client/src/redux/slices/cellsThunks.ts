import { createAsyncThunk } from "@reduxjs/toolkit";
import { Cell } from "../cell";
import axios from "axios";
import { RootState } from "../store";
import PouchDB from 'pouchdb'

const db = new PouchDB<Cell>( 'jsnotebook' )

const info = await db.info()

console.log( 'database info', info)


export const fetchCells = createAsyncThunk<
  Cell[],
  undefined,
  { rejectValue: string }
>("cells/fetchCells", async (_, thunkAPI) => {
  try {
    
    const dataFormDb = await db.allDocs( { include_docs: true } )
    console.log( 'dataFormDb #', dataFormDb.total_rows ) 
    
    const { data }: { data: Cell[] } = await axios.get("/cells");
    return data;
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
  const { data, order } = getState().cells;
  const cells = order.map((id) => data[id]);
  try {
    const res = await db.bulkDocs( cells )
    console.log( 'bulkDocs', res )
    await axios.post("/cells", { cells });
  } catch (error:any) {
    rejectWithValue(error.message);
  }
});
