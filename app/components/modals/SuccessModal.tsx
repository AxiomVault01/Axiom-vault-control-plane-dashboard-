"use client";

import { CheckCircle2, X } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/router";

interface SuccessModalProps {
  onClose: () => void;
  // onSecureAccount: () => void;
  isOpen: boolean;
}

export default function SuccessModal({
  isOpen,
  onClose,
  // onSecureAccount,
}: SuccessModalProps) {
  if (!isOpen) return null;
  
  // const router = useRouter()

  // const Handlesecureaccount = () => {
  //   router.push("/secureaccount")
  // }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[420px] rounded-2xl bg-white px-6 py-8 text-center shadow-xl sm:px-8">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Success Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={38} strokeWidth={2} className="text-green-600" />
        </div>

        {/* Content */}
        <h2 className="text-xl font-semibold text-gray-900">Success</h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Password Changed Successfully
        </p>

        {/* Button */}
        <Link href="/secureaccount">
          <button
            type="button"
            // onClick={Handlesecureaccount}
            className="mt-7 w-full rounded-lg bg-[#0A1F44] px-5 py-3 text-sm font-medium text-white transition cursor-pointer"
          >
            Secure Your Account
          </button>
        </Link>
      </div>
    </div>
  );
}
