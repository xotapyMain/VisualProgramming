import type { GridData } from "../types/type";

export const evaluateFormula = (formula: string, data: GridData): string => {
  if (!formula.startsWith('=')) return formula;

  try {
    let expression = formula.substring(1).toUpperCase();

    expression = expression.replace(/SUM\(([A-Z][0-9]+):([A-Z][0-9]+)\)/g, () => {
      return "0";
    });

    expression = expression.replace(/[A-Z][0-9]+/g, (match) => {
      const cell = data[match];
      return cell ? (cell.display || "0") : "0";
    });

    return String(eval(expression));
  } catch {
    return "#ERROR!";
  }
};