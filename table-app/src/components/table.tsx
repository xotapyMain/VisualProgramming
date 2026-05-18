import React, { useState, useRef } from 'react';
import Cell from './Cell';
import { evaluateFormula, determineCellType } from '../utils/formuls';
import type { GridData, CellId } from '../types/type';

function Spreadsheet() {
  const [cells, setCells] = useState<GridData>({});
  const [selectedCell, setSelectedCell] = useState<CellId | null>(null);
  const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>({});
  const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({});
  const [resizing, setResizing] = useState<{ type: 'col' | 'row', index: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, rowIndex: number } | null>(null);
  const [rowsCount, setRowsCount] = useState(50);
  const startPos = useRef<number>(0);
  const startSize = useRef<number>(0);

  const colsCount = 26;
  const defaultColWidth = 110;
  const defaultRowHeight = 30;

  const handleCellChange = (id: CellId, newValue: string) => {
    setCells(prev => {
      const displayValue = evaluateFormula(newValue, prev);
      const cellType = determineCellType(newValue);
      return {
        ...prev,
        [id]: { value: newValue, display: displayValue, type: cellType }
      };
    });
  };

  const getColumnWidth = (colIndex: number) => columnWidths[colIndex] || defaultColWidth;
  const getRowHeight = (rowIndex: number) => rowHeights[rowIndex] || defaultRowHeight;

  const handleResizeStart = (e: React.MouseEvent, type: 'col' | 'row', index: number) => {
    e.preventDefault();
    setResizing({ type, index });
    startPos.current = type === 'col' ? e.clientX : e.clientY;
    startSize.current = type === 'col' ? getColumnWidth(index) : getRowHeight(index);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = (type === 'col' ? moveEvent.clientX : moveEvent.clientY) - startPos.current;
      const newSize = Math.max(50, startSize.current + delta);

      if (type === 'col') {
        setColumnWidths(prev => ({ ...prev, [index]: newSize }));
      } else {
        setRowHeights(prev => ({ ...prev, [index]: newSize }));
      }
    };

    const handleMouseUp = () => {
      setResizing(null);
      startPos.current = 0;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleContextMenu = (e: React.MouseEvent, rowIndex: number) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, rowIndex });
  };

  const handleAddRow = () => {
    if (contextMenu) {
      setRowsCount(prev => prev + 1);
      setContextMenu(null);
    }
  };

  const handleDeleteRow = () => {
    if (contextMenu && rowsCount > 1) {
      const rowToDelete = contextMenu.rowIndex + 1;
      setCells(prev => {
        const newCells = { ...prev };
        for (let col = 0; col < colsCount; col++) {
          const colLetter = String.fromCharCode(65 + col);
          delete newCells[`${colLetter}${rowToDelete}`];
        }
        return newCells;
      });
      setRowsCount(prev => prev - 1);
      setContextMenu(null);
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  React.useEffect(() => {
    if (contextMenu) {
      document.addEventListener('click', handleCloseContextMenu);
      return () => document.removeEventListener('click', handleCloseContextMenu);
    }
  }, [contextMenu]);

  const gridCols = Array.from({ length: colsCount }, (_, i) => `${getColumnWidth(i)}px`).join(' ');

  return (
    <div>
      <div style={{
        marginBottom: '10px',
        padding: '8px',
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9'
      }}>
        <strong>Панель формул:</strong> {selectedCell ? `${selectedCell}: ${cells[selectedCell]?.value || ''}` : 'Выберите ячейку'}
      </div>

      <div style={{
        display: 'inline-grid',
        gridTemplateColumns: `40px ${gridCols}`,
        gap: '0',
        border: '1px solid #ccc',
        overflow: 'auto',
        maxHeight: '600px',
        maxWidth: '100%'
      }}>
        <div style={{
          border: '1px solid #ccc',
          backgroundColor: '#e0e0e0',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: `${defaultRowHeight}px`,
          height: `${defaultRowHeight}px`,
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 3
        }}></div>

        {Array.from({ length: colsCount }, (_, colIndex) => {
          const colLetter = String.fromCharCode(65 + colIndex);
          return (
            <div
              key={`header-${colIndex}`}
              style={{
                border: '1px solid #ccc',
                backgroundColor: '#e0e0e0',
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: `${defaultRowHeight}px`,
                height: `${defaultRowHeight}px`,
                width: `${getColumnWidth(colIndex)}px`,
                position: 'sticky',
                top: 0,
                zIndex: 2
              }}
            >
              {colLetter}
              <div
                onMouseDown={(e) => handleResizeStart(e, 'col', colIndex)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: '5px',
                  height: '100%',
                  cursor: 'col-resize',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
          );
        })}

        {Array.from({ length: rowsCount }, (_, rowIndex) => {
          const rowNum = rowIndex + 1;
          return (
            <React.Fragment key={`row-${rowIndex}`}>
              <div
                onContextMenu={(e) => handleContextMenu(e, rowIndex)}
                style={{
                  border: '1px solid #ccc',
                  backgroundColor: '#e0e0e0',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  lineHeight: `${getRowHeight(rowIndex)}px`,
                  height: `${getRowHeight(rowIndex)}px`,
                  position: 'sticky',
                  left: 0,
                  zIndex: 1
                }}
              >
                {rowNum}
                <div
                  onMouseDown={(e) => handleResizeStart(e, 'row', rowIndex)}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    cursor: 'row-resize',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>

              {Array.from({ length: colsCount }, (_, colIndex) => {
                const colLetter = String.fromCharCode(65 + colIndex);
                const id = `${colLetter}${rowNum}`;

                return (
                  <Cell
                    key={id}
                    id={id}
                    data={cells[id]}
                    isSelected={selectedCell === id}
                    onSelect={(cellId) => setSelectedCell(cellId)}
                    onChange={handleCellChange}
                    width={getColumnWidth(colIndex)}
                    height={getRowHeight(rowIndex)}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
            minWidth: '150px'
          }}
        >
          <div
            onClick={handleAddRow}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Добавить строку
          </div>
          <div
            onClick={handleDeleteRow}
            style={{
              padding: '8px 12px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Удалить строку
          </div>
        </div>
      )}
    </div>
  );
}

export default Spreadsheet;