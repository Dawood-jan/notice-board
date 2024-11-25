import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import AnimateOnScroll from "../common/AnimateOnScroll";
import { MdDelete } from "react-icons/md";
import { SquarePen } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const AddFaculty = () => {
  const [facultyData, setFacultyData] = useState([]);
  const [error, setError] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/all-faculty`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setFacultyData(response.data.teachers);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "An error occurred while fetching faculty.";
        setError(errorMessage);
      }
    };

    fetchFacultyData();
  }, [auth.token]);

  const handleEdit = (faculty) => {
    navigate(`/admin-dashboard/edit-faculty/${faculty._id}`, {
      state: { faculty },
    });
  };

  // const handleDelete = (facultyId) => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "You want to delete this faculty!",
  //     icon: "warning",
  //     buttons: {
  //       confirm: {
  //         text: "Yes, delete it!",
  //         className: "btn btn-success",
  //       },
  //       cancel: {
  //         visible: true,
  //         className: "btn btn-danger",
  //       },
  //     },
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${import.meta.env.VITE_BASE_URL}users/delete-faculty/${facultyId}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${auth.token}`,
  //             },
  //           }
  //         )
  //         .then(() => {
  //           setFacultyData((prev) =>
  //             prev.filter((faculty) => faculty._id !== facultyId)
  //           );
  //           swal({
  //             title: "Deleted!",
  //             text: "The faculty has been deleted.",
  //             icon: "success",
  //             buttons: {
  //               confirm: {
  //                 className: "btn btn-success",
  //               },
  //             },
  //           });
  //         })
  //         .catch((err) => {
  //           const errorMessage =
  //             err.response?.data?.message || "An error occurred while deleting faculty.";
  //           setError(errorMessage);
  //         });
  //     } else {
  //       swal.close();
  //     }
  //   });
  // };

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
      //         onClick={() => handleDelete(row.original._id)}
      //       >
      //         <MdDelete size={18} />
      //       </button>
      //     </div>
      //   ),
      // },
    ],
    []
  );

  const table = useReactTable({
    data: facultyData,
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
    <div className="p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">
        All Faculty
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="">
        <input
          type="text"
          placeholder="Search faculty..."
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
    </div>
     </AnimateOnScroll>
  );
};

export default AddFaculty;
