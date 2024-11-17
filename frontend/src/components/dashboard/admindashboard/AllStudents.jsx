import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { MdDelete } from "react-icons/md";
import { SquarePen } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import AnimateOnScroll from "../common/AnimateOnScroll";
import FloatingShape from "../../FloatingShape";

const AllStudents = () => {
  const [studentData, setStudentData] = useState([]);
  const [error, setError] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}notices/all-students`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setStudentData(response.data.students);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching students.";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [auth.token]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "fullname",
        header: "Name",
      },
      {
        accessorKey: "department",
        header: "Department",
      },
      {
        accessorKey: "semester",
        header: "Semester",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      // {
      //   header: "Actions",
      //   cell: ({ row }) => (
      //     <div className="flex gap-2">
      //       <button
      //         className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      //         onClick={() => handleEdit(row.original)}
      //       >
      //         <SquarePen size={18} />
      //       </button>
      //       <button
      //         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      //         // onClick={() => handleDelete(row.original._id)}
      //       >
      //         <MdDelete size={18} />
      //       </button>
      //     </div>
      //   ),
      // },
    ],
    []
  );

  const handleEdit = (student) => {
    navigate(`/admin-dashboard/edit-student/${student._id}`, {
      state: { student },
    });
  };

  const table = useReactTable({
    data: studentData,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId) || "";
      return cellValue.toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="">
      <h2 className="text-3xl font-bold text-center mb-6">All Students</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          className="p-2 border rounded w-full"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value || "")}
        />
      </div>
      <table className="table-auto w-full border-collapse border border-gray-200 shadow-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-800 text-white">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-gray-300 px-4 py-2"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc"
                    ? " 🔼"
                    : header.column.getIsSorted() === "desc"
                    ? " 🔽"
                    : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-white hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllStudents;
