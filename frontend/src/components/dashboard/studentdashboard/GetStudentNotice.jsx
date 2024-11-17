import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import FloatingShape from "../../FloatingShape";
import AnimateOnScroll from "../common/AnimateOnScroll";
import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const GetStudentNotice = () => {
  const { id } = useParams();
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [sorting, setSorting] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}notices/student-notice`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
            params: { studentId: auth.studentId }, // Make sure to include student ID in request
          }
        );

        console.log(response.data);

        const sortedNotices = response.data.fullNotices.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        console.log(sortedNotices);
        setNotices(sortedNotices);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching notices."
        );
      }
    };

    fetchNotices();
  }, [auth.token, id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) =>
          row.original.image ? (
            <img
              src={row.original.image}
              alt="Notice"
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            "No Image"
          ),
      },
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "content",
        header: "Content",
        cell: ({ row }) => (
          <div
            dangerouslySetInnerHTML={{
              __html: row.original.content || "No content",
            }}
          />
        ),
      },
      {
        accessorKey: "postedBy",
        header: "Posted By",
        cell: ({ row }) => row.original.postedBy?.fullname || "Unknown",
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {auth.role === "teacher" && (
              <>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleEdit(row.original)}
                >
                  <SquarePen size={18} />
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(row.original._id)}
                >
                  <MdDelete size={18} />
                </button>
              </>
            )}

            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={() => setSelectedNotice(row.original)}
            >
              View
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: notices,
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
   
    

   <>

      <div className="mb-4">
      <h2 className="text-3xl font-bold text-center mb-6">Semester Notices</h2>
        <input
          type="text"
          placeholder="Search notices..."
          className="p-2 border rounded w-full"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value || "")}
        />
      </div>

      <div className="overflow-x-auto">
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
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedNotice && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full">
            {selectedNotice.image && (
              <img
                src={selectedNotice.image}
                alt="Notice"
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-2xl font-bold mb-4">{selectedNotice.title}</h3>
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{
                __html: selectedNotice.content,
              }}
            />

            <p className="text-sm text-gray-500">
              Date:{" "}
              {new Date(selectedNotice.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setSelectedNotice(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </>
  );
};

export default GetStudentNotice;
