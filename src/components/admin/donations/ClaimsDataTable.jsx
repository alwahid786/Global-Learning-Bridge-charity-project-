import React, { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi2";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import ChatModal from "../../shared/small/ChatModal";
import {
  useUpdateClaimsMutation,
  useUpdateClaimsAdditionalDataMutation,
  useDeleteClaimMutation,
  useSendReceiptMutation,
  useGetAllDonationsQuery,
} from "../../../redux/apis/claimsApis";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import EditClaimsModal from "./EditClaimsModal";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import ReceiptModal from "../../admin/donations/ReceiptModal";

// Custom Status Dropdown styled as button=
const StatusDropdown = ({ status, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const dropdownRef = useRef();
  const options = ["PC", "PO", "PQ", "PR", "PA", "CR"];

  // Button color logic
  let btnColor = "bg-[#FFCC00] text-white";
  if (status === "PC") btnColor = "bg-[#3B82F6] text-white";
  else if (status === "PO") btnColor = "bg-[#22C55E] text-white";
  else if (status === "PQ") btnColor = "bg-[#F97316] text-white";
  else if (status === "PR") btnColor = "bg-[#A855F7] text-white";
  else if (status === "PA") btnColor = "bg-[#EAB308] text-black";
  else if (status === "CR") btnColor = "bg-[#EF4444] text-white";

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Positioning
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  return (
    <div className="w-full relative inline-block" ref={ref}>
      <button
        type="button"
        className={`flex items-center ${btnColor} font-semibold rounded-lg px-2 py-2 text-sm w-full justify-between focus:outline-none shadow`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-xs truncate">{status}</span>
        <HiChevronDown className="text-sm" />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-[9999] bg-white rounded-lg shadow-lg border border-gray-200"
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
          >
            {options.map((opt) => (
              <div
                key={opt}
                className={`px-4 py-2 text-xs cursor-pointer hover:bg-[#FFCC00] hover:text-white ${
                  opt === status ? "bg-gray-100 font-semibold" : "text-gray-800"
                }`}
                onClick={() => {
                  setOpen(false);
                  if (onChange) onChange(opt);
                }}
              >
                {opt}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

const customStyles = {
  rows: {
    style: {
      minHeight: "64px",
      padding: "20px 0",
      "&:nth-of-type(even)": {
        backgroundColor: "#f9fafb",
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: "#32B0FF21",
    },
  },
  headCells: {
    style: {
      fontWeight: "bold",
      fontSize: "14px",
    },
  },
};

const ClaimsDataTable = ({ data, onSelectionChange, archived = false }) => {
  const [tableData, setTableData] = useState(data);
  const [chatUser, setChatUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [updateClaims] = useUpdateClaimsMutation();
  const [updateClaimsAdditionalData] = useUpdateClaimsAdditionalDataMutation();
  const [editingCell, setEditingCell] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [infoModal, setInfoModal] = useState(null);
  const [infoModalTitle, setInfoModalTitle] = useState(null);
  const [toggleActionsMenu, setToggleActionsMenu] = useState(null);
  const menuRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editClaim, setEditClaim] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteClaimId, setDeleteClaimId] = useState(null);
  const [deleteClaim] = useDeleteClaimMutation();
  const [showReceipt, setShowReceipt] = useState(null);

  const [sendReceipt] = useSendReceiptMutation();

  const { refetch: refetchDonations } = useGetAllDonationsQuery();

  const handleShowMore = (title, text) => {
    setInfoModal(text);
    setInfoModalTitle(title);
  };

  // Handler to update status for a row
  const handleStatusChange = async (rowIdx, newStatus, row) => {
    setTableData((prev) =>
      prev.map((row, idx) =>
        idx === rowIdx ? { ...row, status: newStatus } : row
      )
    );
    try {
      const res = await updateClaims({
        id: row._id,
        status: newStatus,
        archived: archived,
      }).unwrap();
      toast.success(res.message, { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleEdit = (row) => {
    setIsEditModalOpen(true);
    setEditClaim(row);
  };

  const handleDelete = (row) => {
    setIsDeleteOpen(true);
    setDeleteClaimId(row._id);
  };

  const handleDeleteClaim = async (id) => {
    try {
      const res = await deleteClaim(id).unwrap();
      toast.success(res.message, { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleOnSubmit = async (updatedClaim) => {
    try {
      const res = await updateClaimsAdditionalData({
        id: updatedClaim._id,
        claimData: updatedClaim,
      }).unwrap();
      toast.success(res.message, { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleChatClose = () => {
    setShowChat(null);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditClaim(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setDeleteClaimId(null);
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      handleChatClose();
    }, 1000);
  };

  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setToggleActionsMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendReceipt = async (id) => {
    try {
      const res = await sendReceipt(id).unwrap();
      await refetchDonations();
      toast.success(res.message, { duration: 3000 });
    } catch (error) {
      toast.error(error.data.message, { duration: 3000 });
    }
  };

  // Table columns--------
  const columns = [
    {
      name: "Name",
      selector: (row) => row,
      cell: (row) => (
        <div className="flex flex-col gap-1.5">
          <span className="text-dark font-normal text-xs ">
            {row?.name || "John Doe"}
          </span>
        </div>
      ),
      sortable: true,
      grow: 2,
      width: "250px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.email}</span>
      ),
      sortable: false,
      width: "250px",
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.amount}</span>
      ),
      sortable: true,
      width: "170px",
    },
    {
      name: "Currency",
      selector: (row) => row.currency,
      cell: (row) => (
        <span className="text-dark font-normal text-xs ">{row.currency}</span>
      ),
      sortable: false,
      width: "150px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`font-normal text-xs ${
              row.status === "pending"
                ? "bg-red-500 text-white text-2xl px-3 py-1 rounded-md"
                : row.status === "succeeded"
                ? "bg-yellow-500 text-black text-2xl px-3 py-1 rounded-md"
                : "text-dark"
            }`}
          >
            {row.status}
          </span>
        </div>
      ),
      sortable: false,
      width: "160px",
    },
    {
      name: "Donation Date",
      selector: (row) => row.createdAt,
      cell: (row) => {
        const date = new Date(row.createdAt);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        return (
          <span className="text-dark font-normal text-xs">
            {formattedDate} at {formattedTime}
          </span>
        );
      },
      sortable: true,
      width: "200px",
    },
    {
      name: "View Receipt",
      cell: (row) => (
        <div className="flex justify-center items-center h-full w-full">
          <button
            className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
            onClick={() => setShowReceipt(row)}
          >
            <FontAwesomeIcon
              icon={faFileInvoice}
              className="text-gray-600 text-2xl hover:text-blue-600 transition-all duration-200"
            />
          </button>
        </div>
      ),
      sortable: false,
      width: "130px",
    },
    {
      name: "Send Receipt",
      cell: (row) => (
        <div className="flex justify-center items-center h-full w-full relative">
          <button
            onClick={() => handleSendReceipt(row._id)}
            className="relative flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-all duration-200"
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="text-blue-700 text-lg"
            />
            <span className="font-medium text-sm">
              {row?.sendCount > 0 ? "Resend" : "Send"}
            </span>
            {row?.sendCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                {row?.sendCount}
              </span>
            )}
          </button>
        </div>
      ),
      width: "180px",
    },
  ];

  {
    /* {toggleActionsMenu?._id === row._id && (
            <div
              ref={menuRef}
              className="absolute bottom-0 right-7 mt-2 w-32 bg-white border rounded-lg shadow-lg z-20"
            >
              <button
                onClick={() => {
                  handleEdit(row);
                  setToggleActionsMenu(null);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-bold hover:bg-gray-100"
              >
                <HiOutlinePencil
                  size={20}
                  className="mr-2 inline-block text-yellow-600"
                />
                Edit
              </button>
              <button
                onClick={() => {
                  handleDelete(row);
                  setToggleActionsMenu(null);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-bold hover:bg-gray-100 text-red-500"
              >
                <HiOutlineTrash
                  size={20}
                  className="mr-2 inline-block text-red-600"
                />
                Delete
              </button>
              <button
                onClick={() => {
                  setChatUser(row);
                  setShowChat(true);
                  setToggleActionsMenu(null);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-bold hover:bg-gray-100"
              >
                <HiChatBubbleLeftRight
                  size={20}
                  className="mr-2 inline-block text-primary"
                />
                Send
              </button>
            </div>
          )} */
  }

  return (
    <div className="p-2 overflow-visible w-[97vw] md:w-[98vw] xl:w-[100%] rounded-lg bg-white shadow mt-5 mb-10">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Claims
      </h2>
      <div className="w-[100%]">
        <DataTable
          columns={columns}
          data={tableData}
          selectableRows
          pagination
          highlightOnHover
          customStyles={customStyles}
          className="border- p-1 bg-white relative z-5"
          onSelectedRowsChange={({ selectedRows }) => {
            onSelectionChange(selectedRows);
          }}
        />
      </div>
      {isEditModalOpen && (
        <EditClaimsModal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          claim={editClaim}
          isAdmin={user.role === "admin" ? true : false}
          onSubmit={handleOnSubmit}
        />
      )}
      {isDeleteOpen && (
        <ConfirmationModal
          isOpen={isDeleteOpen}
          onClose={handleDeleteClose}
          onSave={handleDeleteClaim}
          data="Are you sure you want to delete this claim?"
          id={deleteClaimId}
        />
      )}
      {showReceipt && (
        <ReceiptModal
          show={!!showReceipt}
          onClose={() => setShowReceipt(null)}
          data={showReceipt}
        />
      )}
    </div>
  );
};
export default ClaimsDataTable;
