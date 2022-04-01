export type CellType = "code" | "text";

export interface CellStyle {
  height: number
}
export interface Cell {
  id: string
  type: CellType
  content: string
  style?: Partial<CellStyle>
}

export type NotebookLanguage = "javascript" | "typescript";

export interface Notebook {
  language: NotebookLanguage
  cells: Array<Cell>
}

export interface NotebookDoc extends Notebook, PouchDB.Core.IdMeta {
}

export const emprtyNotebook = ():Notebook => ({ language:'javascript', cells: []  })