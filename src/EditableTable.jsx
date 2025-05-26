import React, { useState } from "react";

const initialRow = {
  col1: '',
  col2: '',
  col3: '',
  col4: '',
  col5: '',
  col6: '',
  col7: '',
  col8: '',
  col9: '',
};

export default function EditableTable() {
  function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  const [rows, setRows] = useState([{ id: generateId(), ...initialRow }]);
  const columns = Object.keys(initialRow);

  function updateCell(rowId, colName, value) {
    setRows(prevRows => {
      const newRows = prevRows.map(row =>
        row.id === rowId ? { ...row, [colName]: value } : row
      );
      console.log("Updated rows:", newRows);
      return newRows;
    });
  }

  function addRow() {
    setRows(prevRows => [...prevRows, { id: generateId(), ...initialRow }]);
  }

  console.log("Rendering rows:", rows);

  return (
    <div className="p-4">
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} className="border border-gray-300 bg-gray-100 p-2 text-left">
                {col.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col} className="border border-gray-300 p-1">
                  <input
                    type="text"
                    value={row[col]}
                    onChange={e => updateCell(row.id, col, e.target.value)}
                    className="w-full p-1 border-none outline-none"
                    placeholder={`Enter ${col}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        onClick={addRow} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Row
      </button>
      
      {/* Debug info */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
        <strong>Debug Info:</strong>
        <pre>{JSON.stringify(rows, null, 2)}</pre>
      </div>
    </div>
  );
}