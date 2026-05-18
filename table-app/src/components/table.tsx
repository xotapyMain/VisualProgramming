import React, { useState } from 'react';
import Cell from './Cell';
import { evaluateFormula } from '../utils/formuls';
import type { GridData, CellId } from '../types/type';

const Spreadsheet: React.FC = () => {
  const [cells, setCells] = useState<GridData>({});
  const [selectedCell, setSelectedCell] = useState<CellId | null>(null);

  const rowsCount = 50;
  const colsCount = 26;

  const handleCellChange = (id: CellId, newValue: string) => {
    setCells(prev => {
      const displayValue = evaluateFormula(newValue, prev);
      return {
        ...prev,
        [id]: { value: newValue, display: displayValue }
      };
    });
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${colsCount}, 110px)`,
      gap: '0',
      border: '1px solid #ccc',
      overflow: 'auto',
      maxHeight: '600px',
      maxWidth: '100%'
    }}>
      {Array.from({ length: rowsCount }, (_, rowIndex) =>
        Array.from({ length: colsCount }, (_, colIndex) => {
          const colLetter = String.fromCharCode(65 + colIndex);
          const rowNum = rowIndex + 1;
          const id = `${colLetter}${rowNum}`;

          return (
            <Cell
              key={id}
              id={id}
              data={cells[id]}
              isSelected={selectedCell === id}
              onSelect={(cellId) => setSelectedCell(cellId)}
              onChange={handleCellChange}
            />
          );
        })
      )}
    </div>
  );
};

export default Spreadsheet;