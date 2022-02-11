import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  MoveCell,
  DeleteCell,
  InsertCell,
  UpdateCellLanguage,
  UpdateCellContent,
} from "../payload-types";
import { Cell } from "../cell";
import { fetchCells, saveCells } from "./cellsThunks_db";
//import { fetchCells, saveCells } from "./cellsThunks";
import { sample } from './init-data'

export interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  saveStatus: string | null;
  data: Record<string,Cell>
}

const generateId = () => {
  return Math.random().toString(36).substr(2, 5);
};

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  saveStatus: null,
  data: {},
};

const cellsSlice = createSlice({
  name: "cells",
  initialState,
  reducers: {
    moveCell: (state, action: PayloadAction<MoveCell>) => {
      const { id, direction } = action.payload;
      const index = state.order.findIndex((i) => i === id);

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      // invalid moving direction
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = id;
    },
    deleteCell: (state, action: PayloadAction<DeleteCell>) => {
      const id = action.payload.id;
      state.order = state.order.filter((i) => i !== id);
      delete state.data[id];
    },
    insertCell: (state, action: PayloadAction<InsertCell>) => {
      const { id, type } = action.payload;
      const cell: Cell = {
        id: generateId(),
        content: "",
        type,
        language: "javascript",
      };
      state.data[cell.id] = cell;
      if (id) {
        const index = state.order.findIndex((i) => i === id);
        state.order.splice(index + 1, 0, cell.id);
      } else {
        state.order.unshift(cell.id);
      }
    },
    updateCellContent: (state, action: PayloadAction<UpdateCellContent>) => {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },
    updateCellLanguage: (state, action: PayloadAction<UpdateCellLanguage>) => {
      const { id, language } = action.payload;
      state.data[id].language = language;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCells.fulfilled, (state, { payload }) => {
      if (payload.length !== 0) {
        state.order = payload.map((cell) => cell.id);
        state.data = payload.reduce((accumulator, cell) => {
          accumulator[cell.id] = cell;
          return accumulator;
        }, {} as CellsState["data"]);
      } else {
        state.data = sample.data 
        state.order = sample.order
      }
    });

    builder.addCase(fetchCells.rejected, (state, { payload }) => {
      state.loading = true;
      state.error = payload || "";
    });

    builder.addCase(fetchCells.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(saveCells.fulfilled, (state) => {
      state.saveStatus = "success";
    });

    builder.addCase(saveCells.pending, (state) => {
      state.saveStatus = null;
    });

    builder.addCase(saveCells.rejected, (state, { payload }) => {
      state.saveStatus = payload || "failed to save, please try again";
    });
  },
});

export const {
  moveCell,
  deleteCell,
  updateCellContent,
  updateCellLanguage,
  insertCell,
} = cellsSlice.actions;

export { fetchCells, saveCells };
export const cellsReducer = cellsSlice.reducer;
