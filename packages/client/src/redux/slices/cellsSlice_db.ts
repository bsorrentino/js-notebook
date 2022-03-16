import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cell } from "@bsorrentino/jsnotebook-client-data";
import { 
  moveCell,
  CellsState,
  fetchCells, 
  saveCells, 
  insertCell,
  deleteCell,
  updateCellContent, 
  updateCellLanguage 
} from "./cellsThunks_db";


const slice = () => {

  const initialState: CellsState = {
    loading: false,
    error: null,
    order: [],
    saveStatus: null,
    data: {},
  };

  return createSlice({
    name: "cells",
    initialState,
    reducers: {
      // moveCell: (state, action: PayloadAction<MoveCell>) => {
      //   const { id, direction } = action.payload;
      //   const index = state.order.findIndex((i) => i === id);
  
      //   const targetIndex = direction === "up" ? index - 1 : index + 1;
      //   // invalid moving direction
      //   if (targetIndex < 0 || targetIndex > state.order.length - 1) {
      //     return state;
      //   }
  
      //   state.order[index] = state.order[targetIndex];
      //   state.order[targetIndex] = id;
      // },
      // deleteCell: (state, action: PayloadAction<DeleteCell>) => {
      //   const id = action.payload.id;
      //   state.order = state.order.filter((i) => i !== id);
      //   delete state.data[id];
      // },
      // insertCell: (state, action: PayloadAction<InsertCell>) => {
      //   const { id, type } = action.payload;
      //   const cell: Cell = {
      //     id: generateId(),
      //     content: "",
      //     type,
      //     language: "javascript",
      //   };
      //   state.data[cell.id] = cell;
      //   if (id) {
      //     const index = state.order.findIndex((i) => i === id);
      //     state.order.splice(index + 1, 0, cell.id);
      //   } else {
      //     state.order.unshift(cell.id);
      //   }
      // },
      // updateCellContent: (state, action: PayloadAction<UpdateCellContent>) => {
      //   const { id, content } = action.payload;
      //   state.data[id].content = content;
      // },
      // updateCellLanguage: (state, action: PayloadAction<UpdateCellLanguage>) => {
      //   const { id, language } = action.payload;
      //   state.data[id].language = language;
      // },
    },
    extraReducers: (builder) => {
  
      ////////////////////////
      // fetchCells
      ////////////////////////
      builder.addCase(fetchCells.fulfilled, (state, { payload }) => {      
        state.order = payload.map((cell) => cell.id);
        state.data = payload.reduce<Record<string,Cell>>((accumulator, cell) => {
          accumulator[cell.id] = cell;
          return accumulator;
        }, {});
      });
      
      builder.addCase(fetchCells.pending, (state) => {
        state.loading = true;
        state.error = "";
      });
  
      builder.addCase(fetchCells.rejected, (state, { payload }) => {
        state.error = "failed to fetch cells, please try again"
        state.saveStatus = payload || state.error
      });
  
      ////////////////////////
      // saveCells
      ////////////////////////
      builder.addCase(saveCells.fulfilled, (state) => {
        state.saveStatus = "success";
      });
  
      builder.addCase(saveCells.pending, (state) => {
        state.saveStatus = null;
      });
  
      builder.addCase(saveCells.rejected, (state, { payload }) => {
        state.saveStatus = payload || "failed to save, please try again";
      });
  
      ////////////////////////
      // updateCellContent
      ////////////////////////
      builder.addCase(updateCellContent.fulfilled, (state,action) => {
        const { id, content } = action.meta.arg
        state.data[id].content = content;
        state.saveStatus = "success";
  
      });
  
      builder.addCase(updateCellContent.pending, (state) => {
        state.saveStatus = null;
      });
  
      builder.addCase(updateCellContent.rejected, (state, { payload }) => {
        state.saveStatus = payload || "failed to update content, please try again";
      });
  
      ////////////////////////
      // updateCellLanguage
      ////////////////////////
      builder.addCase(updateCellLanguage.fulfilled, (state,action ) => {
        const { id, language } = action.meta.arg;
        state.data[id].language = language;
        state.saveStatus = "success";
    });
  
      builder.addCase(updateCellLanguage.pending, (state) => {
        state.saveStatus = null;
      });
  
      builder.addCase(updateCellLanguage.rejected, (state, { payload }) => {
        state.saveStatus = payload || "failed to update language, please try again";
      });
  
      ////////////////////////
      // deleteCell
      ////////////////////////
      builder.addCase(deleteCell.fulfilled, (state,action) => {
        const {id} = action.meta.arg
        state.order = state.order.filter((i) => i !== id)
        delete state.data[id];
        state.saveStatus = "success"
      });
  
      builder.addCase(deleteCell.pending, (state) => {
        state.saveStatus = null;
      });
  
      builder.addCase(deleteCell.rejected, (state, { payload }) => {
        state.saveStatus = payload || "failed to delete cell, please try again";
      });
  
      ////////////////////////
      // insertCell
      ////////////////////////
      builder.addCase(insertCell.fulfilled, (state,action) => {
        const { id } = action.meta.arg;
        const cell = action.payload!.newCell
        state.data[cell.id] = cell;
        if (id) {
          const index = state.order.findIndex((i) => i === id);
          state.order.splice(index + 1, 0, cell.id);
        } else {
          state.order.unshift(cell.id);
        }
        state.saveStatus = "success"
      });
  
      builder.addCase(insertCell.pending, (state) => {
        state.saveStatus = null;
      });
  
      builder.addCase(insertCell.rejected, (state, { payload }) => {
        state.saveStatus = payload || "failed to delete cell, please try again";
      });

      ////////////////////////
      // MoveCell
      ////////////////////////
      builder.addCase(moveCell.fulfilled, (state, { payload }) => {      
        state.order = payload;
      });
      
      builder.addCase(moveCell.pending, (state) => {
        state.loading = true;
        state.error = "";
      });
  
      builder.addCase(moveCell.rejected, (state, { payload }) => {
        state.error = "failed to move cell, please try again"
        state.saveStatus = payload || state.error
      });
  
  
    },
  });
  
}

const cellsSlice = slice()

export { 
  moveCell,
  fetchCells, 
  saveCells, 
  updateCellLanguage, 
  updateCellContent,
  deleteCell,
  insertCell
};
export const cellsReducer = cellsSlice.reducer;
