import React, { useState, useEffect, useRef } from 'react';
import type { CellId, CellData } from '../types/type';

export interface CellProps {
  id: CellId;
  data: CellData | undefined;
  isSelected: boolean;
  onSelect: (id: CellId) => void;
  onChange: (id: CellId, newValue: string) => void;
}

const Cell: React.FC<CellProps> = ({ id, data, isSelected, onSelect, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(data?.value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleDoubleClick = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(id, tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur();
    if (e.key === 'Escape') {
      setTempValue(data?.value || '');
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`cell ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(id)}
      onDoubleClick={handleDoubleClick}
      style={{
        border: '1px solid #ccc',
        minWidth: '100px',
        height: '30px',
        backgroundColor: isSelected ? '#e7f1ff' : 'white',
        cursor: 'cell',
        padding: '0 5px',
        lineHeight: '30px'
      }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{ width: '100%', border: 'none', outline: 'none' }}
        />
      ) : (
        data?.display || ''
      )}
    </div>
  );
};

export default Cell;