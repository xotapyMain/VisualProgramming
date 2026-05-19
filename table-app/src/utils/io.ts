import type { GridData, CellData } from '../types/type';
import { evaluateFormula, determineCellType } from './formuls';

export const exportToCSV = (cells: GridData, rowsCount: number, colsCount: number, filename: string): void => {
  const lines: string[] = [];

  for (let r = 1; r <= rowsCount; r++) {
    const rowCells: string[] = [];
    for (let c = 0; c < colsCount; c++) {
      const colLetter = String.fromCharCode(65 + c);
      const cell = cells[`${colLetter}${r}`];
      let value = cell ? cell.display : '';
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      rowCells.push(value);
    }
    lines.push(rowCells.join(','));
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Экспорт в JSON
export const exportToJSON = (cells: GridData, filename: string): void => {
  const blob = new Blob([JSON.stringify(cells, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = (csvText: string): { parsedCells: GridData; maxRows: number; maxCols: number } => {
  const lines = csvText.split(/\r?\n/);
  const parsedCells: GridData = {};
  let maxCols = 0;
  let activeRows = 0;

  lines.forEach((line, rowIndex) => {
    if (!line.trim()) return;
    activeRows = rowIndex + 1;
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
    if (matches.length > maxCols) {
      maxCols = matches.length;
    }

    matches.forEach((rawVal, colIndex) => {
      let val = rawVal.trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }

      if (val) {
        const colLetter = String.fromCharCode(65 + colIndex);
        const id = `${colLetter}${activeRows}`;
        parsedCells[id] = {
          value: val,
          display: val,
          type: determineCellType(val)
        };
      }
    });
  });

  return {
    parsedCells,
    maxRows: Math.max(activeRows, 50),
    maxCols: Math.max(maxCols, 26)
  };
};