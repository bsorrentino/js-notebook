import { createSlice } from "@reduxjs/toolkit"
import { Cell } from "@bsorrentino/jsnotebook-client-data"
import { 
  moveCell,
  resizeCell,
  NotebookState,
  fetchNotebook, 
  exportNotebook, 
  insertCell,
  deleteCell,
  updateCellContent, 
  updateNotebookLanguage, 
  importNotebook
} from "./cellsThunks"


const slice = () => {

  const initialState: NotebookState = {
    loading: false,
    error: null,
    order: [],
    saveStatus: null,
    cells: {},
    language: 'javascript'
  }

  return createSlice({
    name: "cells",
    initialState,
    reducers: {
      // moveCell: (state, action: PayloadAction<MoveCell>) => {
      //   const { id, direction } = action.payload
      //   const index = state.order.findIndex((i) => i === id)
  
      //   const targetIndex = direction === "up" ? index - 1 : index + 1
      //   // invalid moving direction
      //   if (targetIndex < 0 || targetIndex > state.order.length - 1) {
      //     return state
      //   }
  
      //   state.order[index] = state.order[targetIndex]
      //   state.order[targetIndex] = id
      // },
      // deleteCell: (state, action: PayloadAction<DeleteCell>) => {
      //   const id = action.payload.id
      //   state.order = state.order.filter((i) => i !== id)
      //   delete state.data[id]
      // },
      // insertCell: (state, action: PayloadAction<InsertCell>) => {
      //   const { id, type } = action.payload
      //   const cell: Cell = {
      //     id: generateId(),
      //     content: "",
      //     type,
      //     language: "javascript",
      //   }
      //   state.data[cell.id] = cell
      //   if (id) {
      //     const index = state.order.findIndex((i) => i === id)
      //     state.order.splice(index + 1, 0, cell.id)
      //   } else {
      //     state.order.unshift(cell.id)
      //   }
      // },
      // updateCellContent: (state, action: PayloadAction<UpdateCellContent>) => {
      //   const { id, content } = action.payload
      //   state.data[id].content = content
      // },
      // updateCellLanguage: (state, action: PayloadAction<UpdateCellLanguage>) => {
      //   const { id, language } = action.payload
      //   state.data[id].language = language
      // },
    },
    extraReducers: (builder) => {
  
      ////////////////////////
      // fetchCells
      ////////////////////////
      builder.addCase(fetchNotebook.fulfilled, (state, { payload }) => {      
        state.language = payload!.language ?? 'javascript'
        state.order = payload!.cells.map((cell) => cell.id)
        state.cells = payload!.cells.reduce<Record<string,Cell>>((accumulator, cell) => {
          accumulator[cell.id] = cell
          return accumulator
        }, {})
        state.saveStatus = 'fetchNotebook.success'
      })
      builder.addCase(fetchNotebook.pending, (state) => {
        state.loading = true
        state.saveStatus = 'fetchNotebook.loading'
      })
      builder.addCase(fetchNotebook.rejected, (state, { payload }) => {
        state.error = "failed to fetch notebook, please try again"
        state.saveStatus = 'fetchNotebook.error'
      })
      ////////////////////////
      // import notebook
      ////////////////////////
      builder.addCase(importNotebook.fulfilled, (state, {payload}) => {
        if( payload ) {
          state.language = payload.language
          state.order = payload.cells.map( cell => cell.id )
          state.cells = payload.cells.reduce<Record<string,Cell>>( (prev, current) => {
            prev[current.id] = current
            return prev
          } , {})  
          state.saveStatus = 'importNotebook.success'  
        }
      })
      builder.addCase(importNotebook.pending, (state) => {
        state.saveStatus = 'importNotebook.pending'
      })
      builder.addCase(importNotebook.rejected, (state, { payload }) => {
        state.error = payload || "failed to save, please try again"
        state.saveStatus = 'importNotebook.error'
      })
      ////////////////////////
      // export notebook
      ////////////////////////
      builder.addCase(exportNotebook.fulfilled, (state) => {
        state.saveStatus = 'exportNotebook.success'
      })
      builder.addCase(exportNotebook.pending, (state) => {
        state.saveStatus = 'exportNotebook.pending'
      })
      builder.addCase(exportNotebook.rejected, (state, { payload }) => {
        state.error = payload || "failed to save, please try again"
        state.saveStatus = 'exportNotebook.error'
      })
      ////////////////////////
      // updateCellContent
      ////////////////////////
      builder.addCase(updateCellContent.fulfilled, (state,action) => {
        const { id, content } = action.meta.arg
        state.cells[id].content = content
        state.saveStatus = "updateCellContent.success"
  
      })
      builder.addCase(updateCellContent.pending, (state) => {
        state.saveStatus = 'updateCellContent.pending'
      })
      builder.addCase(updateCellContent.rejected, (state, { payload }) => {
        state.error = payload ?? "failed to update content, please try again"
        state.saveStatus = 'updateCellContent.error'
      })  
      ////////////////////////
      // resizeCell
      ////////////////////////
      builder.addCase(resizeCell.fulfilled, (state,action) => {
        const { id, height } = action.meta.arg
        state.cells[id].height = height
        state.saveStatus = "resizeCell.success"
  
      })
      builder.addCase(resizeCell.pending, (state) => {
        state.saveStatus = 'resizeCell.pending'
      })
      builder.addCase(resizeCell.rejected, (state, { payload }) => {
        state.error = payload ?? "failed to resize cell, please try again"
        state.saveStatus = 'resizeCell.error'
      })  
      ////////////////////////
      // updateCellLanguage
      ////////////////////////
      builder.addCase(updateNotebookLanguage.fulfilled, (state,action ) => {
        const { language } = action.meta.arg
        state.language = language
        state.saveStatus = "updateCellLanguage.success"
      })
      builder.addCase(updateNotebookLanguage.pending, (state) => {
        state.saveStatus = 'updateCellLanguage.success'
      })
      builder.addCase(updateNotebookLanguage.rejected, (state, { payload }) => {
        state.error = payload ?? "failed to update language, please try again"
        state.saveStatus = 'updateCellLanguage.error'
      })
      ////////////////////////
      // deleteCell
      ////////////////////////
      builder.addCase(deleteCell.fulfilled, (state,action) => {
        const {id} = action.meta.arg
        state.order = state.order.filter((i) => i !== id)
        delete state.cells[id]
        state.saveStatus = "deleteCell.success"
      })
      builder.addCase(deleteCell.pending, (state) => {
        state.saveStatus = 'deleteCell.pending'
      })
      builder.addCase(deleteCell.rejected, (state, { payload }) => {
        state.error = payload ?? "failed to delete cell, please try again"
        state.saveStatus = 'deleteCell.error'
      })
      ////////////////////////
      // insertCell
      ////////////////////////
      builder.addCase(insertCell.fulfilled, (state,action) => {
        const { id } = action.meta.arg
        const cell = action.payload!.newCell
        state.cells[cell.id] = cell
        if (id) {
          const index = state.order.findIndex((i) => i === id)
          state.order.splice(index + 1, 0, cell.id)
        } else {
          state.order.unshift(cell.id)
        }
        state.saveStatus = "insertCell.success"
      })
      builder.addCase(insertCell.pending, (state) => {
        state.saveStatus = 'insertCell.pending'
      })
      builder.addCase(insertCell.rejected, (state, { payload }) => {
        state.error = payload ?? "failed to delete cell, please try again"
        state.saveStatus = 'insertCell.error'
      })
      ////////////////////////
      // MoveCell
      ////////////////////////
      builder.addCase(moveCell.fulfilled, (state, { payload }) => {      
        state.order = payload
        state.saveStatus = 'moveCell.success'
      })      
      builder.addCase(moveCell.pending, (state) => {
        state.loading = true
        state.saveStatus = 'moveCell.pending'
      })
      builder.addCase(moveCell.rejected, (state, { payload }) => {
        state.error = payload ?? "failed to move cell, please try again"
        state.saveStatus = 'moveCell.error' 
      })
  
  
    },
  })
  
}

const cellsSlice = slice()

// export sync action
export const {
  
} = cellsSlice.actions;

// export async actions
export { 
  moveCell,
  resizeCell,
  fetchNotebook, 
  exportNotebook, 
  updateNotebookLanguage, 
  updateCellContent,
  deleteCell,
  insertCell,
  importNotebook
}
export const cellsReducer = cellsSlice.reducer
