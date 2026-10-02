"use client";

import { useState } from "react";
import { Check, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-4 py-4 sm:px-6">
      <div className="mx-auto min-h-[calc(100vh-32px)] w-full max-w-[1008px] rounded-[22px] bg-[#f7f7f7] px-5 py-10 sm:px-10 md:px-[72px] md:py-12">
        {/* Top Icon */}
        <div className="flex justify-center">
          <div className="flex h-[168px] w-[168px] items-center justify-center rounded-full bg-[#0b2b5d] sm:h-[172px] sm:w-[172px]">
            <CheckCircle2 size={72} strokeWidth={1.6} className="text-white" />
          </div>
        </div>

        {/* Logo */}
        <div className="mt-[48px] flex justify-center">
          <AxiomVaultLogo />
        </div>

        {/* Heading */}
        <div className="mt-[48px] text-center">
          <h1 className="text-[38px] font-bold leading-[1.15] tracking-[-1.2px] text-[#101828]">
            Welcome Back
          </h1>

          <p className="mt-7 text-[20px] leading-[1.4] text-[#4b5563]">
            Sign in to manage the AxiomVault platform.
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-[76px]">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-[10px] block text-[19px] font-medium text-[#303846]"
            >
              Work Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="admin@company.com"
              className="h-[64px] w-full rounded-[15px] border border-[#d4d7dc] bg-white px-4 text-[18px] text-[#202633] outline-none placeholder:text-[#d3d5d8] focus:border-[#0b2b5d] focus:ring-1 focus:ring-[#0b2b5d]"
            />
          </div>

          {/* Password */}
          <div className="mt-[42px]">
            <label
              htmlFor="password"
              className="mb-[10px] block text-[19px] font-medium text-[#303846]"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                className="h-[64px] w-full rounded-[15px] border border-[#d4d7dc] bg-white px-4 pr-14 text-[18px] text-[#202633] outline-none placeholder:text-[#d3d5d8] focus:border-[#0b2b5d] focus:ring-1 focus:ring-[#0b2b5d]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#252a32]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Eye size={27} strokeWidth={1.8} />
                ) : (
                  <EyeOff size={27} strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="mt-5 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-4">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border transition ${
                  rememberMe
                    ? "border-[#0b2b5d] bg-[#0b2b5d]"
                    : "border-[#d1d3d6] bg-[#e8e8e8]"
                }`}
              >
                {rememberMe && (
                  <Check size={19} strokeWidth={3} className="text-white" />
                )}
              </button>

              <span className="text-[17px] font-semibold text-[#414751]">
                Remember me
              </span>
            </label>

            <button
              type="button"
              className="text-[17px] font-medium text-[#5591c8] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login */}
          <button
            type="submit"
            className="mt-[58px] h-[64px] w-full rounded-[10px] bg-[#082a5d] text-[20px] font-medium text-white transition hover:bg-[#0a326d]"
          >
            Login
          </button>
        </form>

        {/* OR */}
        <div className="my-[58px] flex items-center gap-5">
          <div className="h-px flex-1 bg-[#e2e3e5]" />

          <span className="text-[19px] font-medium text-[#555c66]">OR</span>

          <div className="h-px flex-1 bg-[#e2e3e5]" />
        </div>

        {/* Microsoft */}
        <button
          type="button"
          className="flex h-[70px] w-full items-center rounded-full bg-white px-8 text-left shadow-[0_1px_5px_rgba(0,0,0,0.02)]"
        >
          <MicrosoftIcon />

          <span className="ml-5 text-[20px] font-medium text-[#414751]">
            Continue with Microsoft
          </span>
        </button>

        {/* Google */}
        <button
          type="button"
          className="mt-[34px] flex h-[70px] w-full items-center rounded-full bg-white px-8 text-left shadow-[0_1px_5px_rgba(0,0,0,0.02)]"
        >
          <GoogleIcon />

          {/* Kept exactly as shown in the reference */}
          <span className="ml-5 text-[20px] font-medium text-[#414751]">
            Continue with Microsoft
          </span>
        </button>
      </div>
    </main>
  );
}

/* ---------------- Logo ---------------- */

function AxiomVaultLogo() {
  return (
    <div className="flex items-center">
      {/* Logo mark */}
      <div className="relative mr-[7px] h-[48px] w-[45px]">
        <div className="absolute left-[9px] top-0 h-[33px] w-[25px] rotate-[18deg] rounded-[6px] border-[7px] border-[#c76117] border-b-0" />

        <div className="absolute bottom-[3px] left-[1px] h-[20px] w-[40px] rotate-[7deg] rounded-[50%] border-[7px] border-[#0b3769] border-t-0" />
      </div>

      <div className="flex items-baseline text-[29px] font-bold tracking-[-1.7px]">
        <span className="text-[#c76117]">Axiom</span>
        <span className="text-[#123b6c]">Vault</span>
      </div>
    </div>
  );
}

/* ---------------- Microsoft Icon ---------------- */

function MicrosoftIcon() {
  return (
    <div className="grid h-[30px] w-[30px] grid-cols-2 grid-rows-2 gap-[2px]">
      <span className="bg-[#f35325]" />
      <span className="bg-[#81bc06]" />
      <span className="bg-[#05a6f0]" />
      <span className="bg-[#ffba08]" />
    </div>
  );
}

/* ---------------- Google Icon ---------------- */

function GoogleIcon() {
  return (
    <div className="flex h-[30px] w-[30px] items-center justify-center">
      <span className="text-[27px] font-bold text-[#4285f4]">G</span>
    </div>
  );
}
