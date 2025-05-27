import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./EditableTable.css";

const defaultRow = (columns) => {
  const row = {
    id: Date.now() + Math.random().toString(36).slice(2),
  };
  columns.forEach((col) => {
    row[col] = "";
  });
  return row;
};

export default function EditableTable() {
  const [columnCount, setColumnCount] = useState(9);
  const [columnsDef, setColumnsDef] = useState(
    Array.from({ length: 9 }, (_, i) => `col${i + 1}`)
  );
  const [data, setData] = useState([defaultRow(columnsDef)]);

  const updateData = (rowIndex, columnId, value) => {
    setData((old) => {
      const newData = [...old];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: value,
      };
      return newData;
    });
  };

  const removeRow = (rowIndex) => {
    setData((old) => old.filter((_, idx) => idx !== rowIndex));
  };

  const addRow = () => {
    setData((old) => [...old, defaultRow(columnsDef)]);
  };

  const addColumn = () => {
    const newCol = `col${columnCount + 1}`;
    const newColumnsDef = [...columnsDef, newCol];
    setColumnCount(columnCount + 1);
    setColumnsDef(newColumnsDef);
    setData((oldData) =>
      oldData.map((row) => ({ ...row, [newCol]: "" }))
    );
  };

  const removeColumn = () => {
    if (columnCount <= 1) return;
    const newColumnsDef = columnsDef.slice(0, -1);
    const colToRemove = columnsDef[columnsDef.length - 1];
    setColumnCount(columnCount - 1);
    setColumnsDef(newColumnsDef);
    setData((oldData) =>
      oldData.map(({ [colToRemove]: _, ...rest }) => rest)
    );
  };

  const handleSubmit = () => {
    console.log("Submitting data:", data);
    // Placeholder for future SQL submission logic
  };

  const columns = columnsDef.map((colId) => ({
    accessorKey: colId,
    header: colId.toUpperCase(),
    cell: ({ row, column }) => (
      <input
        defaultValue={data[row.index][column.id]}
        onBlur={(e) => updateData(row.index, column.id, e.target.value)}
        className="input"
        placeholder={`Enter ${column.id}`}
      />
    ),
  }));

  columns.push({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button className="delete-button" onClick={() => removeRow(row.index)}>
        Delete
      </button>
    ),
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-wrapper">
      <div className="controls">
        <button className="add-button" onClick={addRow}>Add Row</button>
        <button className="add-button" onClick={addColumn}>Add Column</button>
        <button className="delete-button" onClick={removeColumn}>Remove Column</button>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
