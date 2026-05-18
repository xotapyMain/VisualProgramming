import type { GridData, CellType } from "../types/type";

const getCellValue = (cellId: string, data: GridData): number => {
  const cell = data[cellId];
  if (!cell) return 0;
  const num = parseFloat(cell.display);
  return isNaN(num) ? 0 : num;
};

const parseRange = (start: string, end: string): string[] => {
  const startCol = start.charCodeAt(0);
  const endCol = end.charCodeAt(0);
  const startRow = parseInt(start.substring(1));
  const endRow = parseInt(end.substring(1));

  const cells: string[] = [];
  for (let col = startCol; col <= endCol; col++) {
    for (let row = startRow; row <= endRow; row++) {
      cells.push(String.fromCharCode(col) + row);
    }
  }
  return cells;
};

export const determineCellType = (value: string): CellType => {
  if (!value || value.trim() === '') return 'empty';
  if (value.startsWith('=')) return 'formula';
  if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') return 'boolean';
  if (!isNaN(parseFloat(value)) && isFinite(Number(value))) return 'number';
  return 'empty';
};

export const evaluateFormula = (formula: string, data: GridData): string => {
  if (!formula.startsWith('=')) return formula;

  try {
    let expression = formula.substring(1).toUpperCase();

    expression = expression.replace(/SUM\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)/g, (_, start, end) => {
      const cells = parseRange(start, end);
      const sum = cells.reduce((acc, cellId) => acc + getCellValue(cellId, data), 0);
      return String(sum);
    });

    expression = expression.replace(/AVERAGE\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)/g, (_, start, end) => {
      const cells = parseRange(start, end);
      const sum = cells.reduce((acc, cellId) => acc + getCellValue(cellId, data), 0);
      return String(cells.length > 0 ? sum / cells.length : 0);
    });

    expression = expression.replace(/[A-Z]+[0-9]+/g, (match) => {
      return String(getCellValue(match, data));
    });

    return String(eval(expression));
  } catch {
    return "#ERROR!";
  }
};