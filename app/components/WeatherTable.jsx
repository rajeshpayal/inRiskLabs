"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import { Button } from "./ui/Button";

export default function WeatherTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const currentTableData = data
    ? data.time.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      )
    : [];

  useEffect(() => {
    if (data) {
      const total = data.time.length;
      const pages = Math.ceil(total / rowsPerPage);
      setTotalRows(total);
      setTotalPages(pages);
      setCurrentPage((prev) => Math.min(prev, pages));
    }
  }, [data, rowsPerPage]);

  return (
    <div className="mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage" className="text-sm font-medium">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => {
              const newRows = parseInt(e.target.value, 10);
              setRowsPerPage(newRows);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <p className="text-sm text-gray-500">
          Showing {(currentPage - 1) * rowsPerPage + 1}–
          {Math.min(currentPage * rowsPerPage, totalRows)} of {totalRows}{" "}
          entries
        </p>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Max Temp (°C)</TableHead>
              <TableHead>Min Temp (°C)</TableHead>
              <TableHead>Mean Temp (°C)</TableHead>
              <TableHead>Max Apparent Temp (°C)</TableHead>
              <TableHead>Min Apparent Temp (°C)</TableHead>
              <TableHead>Mean Apparent Temp (°C)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTableData.map((date, i) => {
              const idx = (currentPage - 1) * rowsPerPage + i;
              return (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{data.temperature_2m_max[idx]}</TableCell>
                  <TableCell>{data.temperature_2m_min[idx]}</TableCell>
                  <TableCell>{data.temperature_2m_mean[idx]}</TableCell>
                  <TableCell>{data.apparent_temperature_max[idx]}</TableCell>
                  <TableCell>{data.apparent_temperature_min[idx]}</TableCell>
                  <TableCell>{data.apparent_temperature_mean[idx]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <Button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
