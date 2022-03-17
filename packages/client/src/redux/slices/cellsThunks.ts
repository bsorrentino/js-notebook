import { createAsyncThunk } from "@reduxjs/toolkit";
import { Cell } from "@bsorrentino/jsnotebook-client-data";
import { RootState } from "../store";


export const fetchCells = createAsyncThunk<
  Cell[],
  undefined,
  { rejectValue: string }
>("cells/fetchCells", async (_, thunkAPI) => {
  try {
    const response = await fetch("/cells")
    const data:Cell[] = await response.json()
    return data;
  } catch (error:any) {
    thunkAPI.rejectWithValue(error.message);
  }
  return [];
});

export const exportNotebook = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string; state: RootState }
>("cells/export", async (_, { getState, rejectWithValue }) => {
  const { data, order } = getState().cells;
  const cells = order.map((id) => data[id]);
  try {
    
    await fetch("/cells", { 
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(cells)
     });
  } catch (error:any) {
    rejectWithValue(error.message);
  }
});
