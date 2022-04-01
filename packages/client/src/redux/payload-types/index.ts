import { Cell, NotebookLanguage, CellType, Notebook } from "@bsorrentino/jsnotebook-client-data";

export interface ResizeCell {
  id: string;
  height: number;
}

type MoveDirection = "up" | "down";

export interface MoveCell {
  id: string;
  direction: MoveDirection;
}

export interface DeleteCell {
  id: string;
}

export interface InsertCell {
  id: string | null;
  type: CellType;
}

export interface UpdateCellContent {
  id: string;
  content: string;
}

export interface UpdateNotebookLanguage {
  language: NotebookLanguage;
}

export interface BundlerInput {
  id: string;
  input: string;
  hasTypescript: boolean;
}

export interface BundlerOutput {
  code: string;
  error: string;
}

export type ImportNotebook = Notebook
