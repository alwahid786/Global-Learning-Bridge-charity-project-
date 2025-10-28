import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import logo from "../../../assets/logo/Logo.jpg";
import toast from "react-hot-toast";
import { useDownloadReceiptMutation } from "../../../redux/apis/claimsApis";
import saveAs from "file-saver";

export default function ReceiptModal({ show, onClose, data }) {
  const [downloadReceipt] = useDownloadReceiptMutation();

  const handleDownloadReceipt = async () => {
    try {
      const res = await downloadReceipt(data._id).unwrap();
      saveAs(res, "receipt.pdf");
      toast.success(res.message || "Receipt Downloaded", { duration: 3000 });
    } catch (error) {
      toast.error(error.data.message || "Failed to download receipt", {
        duration: 3000,
      });
    }
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // click outside to close
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <HiXMark size={24} />
            </button>

            {/* Company Header */}
            <div className="flex flex-col items-center mb-6 border-b pb-4">
              <img
                src={logo}
                alt="Company Logo"
                className="w-30 h-30 object-contain mb-2"
              />
              <h2 className="text-lg font-bold text-gray-800">
                Global Learning Bridge
              </h2>
              <p className="text-sm text-gray-500">Official Donation Receipt</p>
            </div>

            {/* Receipt Details */}
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Donor Name:</span>
                <span>{data?.name || "N/A"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Email:</span>
                <span>{data?.email || "N/A"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Amount:</span>
                <span>
                  {data?.amount || "0"} {data?.currency || ""}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span
                  className={`font-medium ${
                    data?.status === "succeeded"
                      ? "text-green-600"
                      : data?.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {data?.status || "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Transaction ID:</span>
                <span className="text-gray-800 break-all">
                  {data?.transactionId || "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Date:</span>
                <span>
                  {new Date(data?.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t pt-3 text-center text-xs text-gray-500">
              <p>Thank you for your generous contribution ❤️</p>
              <p>— Global Learning Bridge Foundation</p>
            </div>
            <div className="flex justify-center my-5">
              <button
                onClick={handleDownloadReceipt}
                className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Download Receipt
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
