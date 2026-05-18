export type CellId = string;

export type CellType = 'number' | 'formula' | 'boolean' | 'empty';

export interface CellData {
  value: string;
  display: string;
  type: CellType;
}

export interface GridData {
  [key: string]: CellData;
}

export interface TableConfig {
  rows: number;
  cols: number;
}