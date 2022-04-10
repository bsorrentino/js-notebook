export type CellType = "code" | "text";

export interface Cell {
  id: string
  type: CellType
  content: string
  height: number,
  // typescript declarations for cell
  // valid only for cell type = 'code' and notebook language = 'typescript'
  dts?: string 
}

export type NotebookLanguage = "javascript" | "typescript";

export interface Notebook {
  language: NotebookLanguage
  cells: Array<Cell>
}

export interface NotebookDoc extends Notebook, PouchDB.Core.IdMeta {
}

export const emprtyNotebook = ():Notebook => ({ language:'javascript', cells: [] })