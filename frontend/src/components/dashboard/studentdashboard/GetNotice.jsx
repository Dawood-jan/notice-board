import React, { useState, useEffect, useContext } from "react";
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
import FloatingShape from "../../FloatingShape";
import AnimateOnScroll from "../common/AnimateOnScroll";

const GetNotice = () => {
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
          `${import.meta.env.VITE_BASE_URL}users/notices`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
            params: {
              department: auth.department, // Send department as a query parameter
            },
          }
        );

        console.log(response.data);

        const sortedNotices = response.data.notices.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotices(sortedNotices);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "An error occurred while fetching notices.";
        setError(errorMessage);
      }
    };

    fetchNotices();
  }, [auth.token]);

  // Columns for Data Table
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
      // {
      //   accessorKey: "createdAt",
      //   header: "Date",
      //   cell: ({ row }) =>
      //     new Date(row.original.createdAt).toLocaleDateString(undefined, {
      //       year: "numeric",
      //       month: "long",
      //       day: "numeric",
      //     }),
      // },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
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
    <AnimateOnScroll animation="fade-up" duration={1000}>
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Department Notices
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="">
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
            {console.log(selectedNotice)}
            <p className=" mb-4">
              PostedBy: {selectedNotice.postedBy.fullname}
            </p>

            <p className=" text-gray-500">
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
    </div>
    </AnimateOnScroll>
  );
};

export default GetNotice;
