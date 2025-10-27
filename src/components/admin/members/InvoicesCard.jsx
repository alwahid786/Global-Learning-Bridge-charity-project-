import { useState } from "react";
import { Switch } from "@headlessui/react";
import { HiPencil, HiTrash, HiOutlineEye } from "react-icons/hi";
import toast from "react-hot-toast";
import { useChangeMemberAccessMutation } from "../../../redux/apis/invoiceApis";

export default function InvoiceCard({ invoice, onEdit, onDelete }) {
  const member = invoice;
  const [enabled, setEnabled] = useState(member?.status === "enabled");
  const [changeMemberStatus] = useChangeMemberAccessMutation();

  const toggleStatus = async () => {
    const newStatus = enabled ? "disabled" : "enabled";
    setEnabled(!enabled);

    try {
      const res = await changeMemberStatus({
        id: member._id,
        data: newStatus,
      }).unwrap();

      toast.success(res?.message || `Member ${newStatus} successfully`, {
        duration: 3000,
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update member status", {
        duration: 3000,
      });
    }
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-md border border-gray-200 p-5 transition-all duration-300 hover:shadow-lg ${
        enabled ? "opacity-100" : "opacity-60"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900">
          {member?.name || "Unnamed Member"}
        </h2>
        {/* Enable/Disable Switch */}
        <Switch
          checked={enabled}
          onChange={toggleStatus}
          className={`${
            enabled ? "bg-green-500" : "bg-gray-300"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span
            className={`${
              enabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
          />
        </Switch>
      </div>

      {/* Content */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Email:</span>
          <span className="text-gray-800">{member?.email}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Phone:</span>
          <span className="text-gray-800">{member?.phone || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Join Date:</span>
          <span className="text-gray-800">
            {new Date(member?.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-100" />

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onEdit(member)}
          className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-amber-100 transition"
        >
          <HiPencil /> Edit
        </button>

        <button
          onClick={() => onDelete(member)}
          className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-100 transition"
        >
          <HiTrash /> Delete
        </button>
      </div>
    </div>
  );
}
