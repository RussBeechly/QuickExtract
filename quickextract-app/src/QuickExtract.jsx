
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function QuickExtract() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState({});
  const [displayCols, setDisplayCols] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
      setData(worksheet);
      setColumns(Object.keys(worksheet[0] || {}));
    };

    reader.readAsBinaryString(file);
  };

  const handleFilterChange = (col, value) => {
    setFilters({ ...filters, [col]: value });
  };

  const applyFilters = () => {
    return data.filter((row) => {
      return Object.entries(filters).every(([key, val]) => {
        return val ? String(row[key]).toLowerCase().includes(val.toLowerCase()) : true;
      });
    });
  };

  const exportToCSV = () => {
    const exportData = filteredData.map(row => {
      const filteredRow = {};
      displayCols.forEach(col => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FilteredData");
    XLSX.writeFile(wb, "filtered_data.csv");
  };

  const exportToXLSX = () => {
    const exportData = filteredData.map(row => {
      const filteredRow = {};
      displayCols.forEach(col => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FilteredData");
    XLSX.writeFile(wb, "filtered_data.xlsx");
  };

  const filteredData = applyFilters();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">QuickExtract: Spreadsheet Filter Tool</h1>
      <Input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />

      {columns.length > 0 && (
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <div className="grid grid-cols-2 gap-4">
              {columns.map((col) => (
                <Input key={col} placeholder={`Filter by ${col}`} onChange={(e) => handleFilterChange(col, e.target.value)} />
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-4">Select Columns to Display</h2>
            <div className="grid grid-cols-3 gap-2">
              {columns.map((col) => (
                <label key={col} className="flex items-center space-x-2">
                  <input type="checkbox" checked={displayCols.includes(col)} onChange={(e) => {
                    const newCols = e.target.checked ? [...displayCols, col] : displayCols.filter((c) => c !== col);
                    setDisplayCols(newCols);
                  }} />
                  <span>{col}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-4 mt-4">
              <Button onClick={exportToCSV}>Export to CSV</Button>
              <Button onClick={exportToXLSX}>Export to Excel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredData.length > 0 && (
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Filtered Data</h2>
            <div className="overflow-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr>
                    {displayCols.map((col) => (
                      <th key={col} className="border p-2 text-left font-bold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => (
                    <tr key={idx}>
                      {displayCols.map((col) => (
                        <td key={col} className="border p-2">{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
