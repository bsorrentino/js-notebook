export type CellTypes = "code" | "text";

export type CellLanguages = "javascript" | "typescript";

export interface Cell extends Partial<PouchDB.Core.IdMeta> {
  id: string
  type: CellTypes
  content: string
  language?: CellLanguages
}
