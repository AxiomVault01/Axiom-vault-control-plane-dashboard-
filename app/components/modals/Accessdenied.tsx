"use client";

import { CheckCircle2, ShieldKeyhole, X, XCircle } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/router";

interface SuccessModalProps {
  onClose: () => void;
  // onSecureAccount: () => void;
  isOpen: boolean;
}

export default function Accessdenied({
  isOpen,
  onClose,
  // onSecureAccount,
}: SuccessModalProps) {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white px-6 py-8 text-center shadow-xl sm:px-8">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 cursor-pointer"
          aria-label="Close modal"
        >
          <XCircle size={28} />
        </button>

        {/* Success Icon */}
        <div className="mx-auto mb-5 flex h-22 w-22 items-center justify-center rounded-full bg-[#0A1F44]">
          <ShieldKeyhole size={38} strokeWidth={2} className="text-white" />
        </div>

        {/* Content */}
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          You don't have permission to access the AxiomVault Admin Control
          Panel. Contact your organisation administrator to request permission.
        </p>

        {/* Button */}
        <div className="flex justify-center  gap-3 w-full p-2 mt-3">
          <Link href="/secureaccount" className="w-full">
            <button
              type="button"
              // onClick={Handlesecureaccount}
              className=" w-full rounded-lg bg-[#0A1F44] px-5 py-3 text-sm font-medium text-white transition cursor-pointer"
            >
              Contact Administrator
            </button>
          </Link>
          
            <button
              type="button"
              onClick={onClose}
              className=" w-full rounded-lg bg-[#fff] px-5 py-3 text-sm font-medium text-[#0A1F44] border border-[#0A1F44] transition cursor-pointer"
            >
              Return to Login
            </button>
        </div>
      </div>
    </div>
  );
}
