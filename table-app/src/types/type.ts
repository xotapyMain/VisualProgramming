export type CellId = string;

export interface CellData {
  value: string;
  display: string;
}

export interface GridData {
  [key: string]: CellData;
}

export interface TableConfig {
  rows: number;
  cols: number;
}