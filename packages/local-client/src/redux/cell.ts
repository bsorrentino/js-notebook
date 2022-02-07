export type CellTypes = "code" | "text";

export type CellLanguages = "javascript" | "typescript";

export interface Cell {
  _id: string;
  type: CellTypes;
  content: string;
  language?: CellLanguages;
}
