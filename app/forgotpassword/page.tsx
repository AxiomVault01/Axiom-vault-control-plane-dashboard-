"use client";

import { ArrowLeft, CheckCircle2, Info, Key } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword (){
    const [email, setEmail] = useState<string>()
 
  return (
    <section className="min-h-screen bg-[#f8f9fa] px-4 py-4 sm:px-6">
      <div className="relative  w-full max-w-[580px] mx-auto rounded-2xl bg-white px-6 py-8 text-center shadow-xl sm:px-8 mt-60">
        {/* Close */}
        <Link href={"/login"}>
          <button
            type="button"
            className=" left-4 top-4 text-gray-400 transition hover:text-gray-600 cursor-pointer flex gap-2 items-center"
            aria-label="Back"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </Link>

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#0A1F44]">
          <Key size={38} strokeWidth={2} className="text-white" />
        </div>

        {/* Content */}
        <h2 className="text-xl font-semibold text-gray-900">
          Authentication Enabled
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          MFA has been successfully configured for your account
        </p>

        <form  className="mt-6">
          <div>
            <label
              htmlFor="email"
              className="mb-[10px] block text-[14px] font-medium text-[#303846]"
            >
              Work Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`py-2 w-full rounded-[15px] border border-[#d4d7dc] bg-white px-4 text-[18px] text-[#202633] outline-none placeholder:text-[#d3d5d8] focus:border-[#0b2b5d] focus:ring-1 focus:ring-[#0b2b5d]`}
            />
          </div>
          {/* Button */}

          <button
            type="button"
            // onClick={Handlesecureaccount}
            className="mt-7 w-full rounded-lg bg-[#0A1F44] px-5 py-3 text-sm font-medium text-white transition cursor-pointer"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </section>
  );
}
