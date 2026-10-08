"use client";

import { FormEvent, useState } from "react";
import { Check, CheckCircle2, Eye, EyeOff, Loader } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import Accessdenied from "../components/modals/Accessdenied";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccessmodalopen, setIssuccessmodalopen] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email checks
    if (!email.trim()) {
      newErrors.email = "Email cannot be empty";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    // Password checks
    if (!password.trim()) {
      newErrors.password = "Password cannot be empty";
    } else if (
      password.length < 12 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      newErrors.password =
        "Password must be at least 12 characters and include an uppercase letter and a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all input fields to continue");
    }

    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        email,
        password,
        rememberMe,
      };
      console.log(payload, "login payload");
      setIssuccessmodalopen(true);
      // api call logic goes here
    } catch (err: any) {
      console.error(err.message, "form error message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-4 py-4 sm:px-6">
      <div className="mx-auto min-h-[calc(100vh-32px)] w-full max-w-[800px] rounded-[22px] bg-[#f7f7f7] px-5 py-10 sm:px-10 md:px-[72px] md:py-12">
        {/* Top Icon */}
        <div className="flex justify-center">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#0b2b5d] sm:h-[90px] sm:w-[90px]">
            <CheckCircle2 size={50} strokeWidth={1.6} className="text-white" />
          </div>
        </div>

        {/* Logo */}
        <div className="mt-[30px] flex justify-center">
          <AxiomVaultLogo />
        </div>

        {/* Heading */}
        <div className="mt-[48px] text-center">
          <h1 className="text-[32px] font-bold leading-[1.15] tracking-[-1.2px] text-[#101828]">
            Welcome Back
          </h1>

          <p className="mt-7 text-[16px] leading-[1.4] text-[#4b5563]">
            Sign in to manage the AxiomVault platform.
          </p>
        </div>
        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-[23px]">
          {/* Email */}
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
              className={`py-3 w-full rounded-[15px] border border-[#d4d7dc] bg-white px-4 text-[18px] text-[#202633] outline-none placeholder:text-[#d3d5d8] focus:border-[#0b2b5d] focus:ring-1 focus:ring-[#0b2b5d] ${errors.email ? "border-red-600" : ""}`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mt-[42px]">
            <label
              htmlFor="password"
              className="mb-[10px] block text-[14px] font-medium text-[#303846]"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`py-3 w-full rounded-[15px] border border-[#d4d7dc] bg-white px-4 pr-14 text-[18px] text-[#202633] outline-none placeholder:text-[#d3d5d8] focus:border-[#0b2b5d] focus:ring-1 focus:ring-[#0b2b5d] ${errors.password ? "border-red-600" : ""}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#252a32]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Eye size={20} strokeWidth={1.8} />
                ) : (
                  <EyeOff size={20} strokeWidth={1.8} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="mt-5 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-4">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`flex h-[20px] w-[20px] items-center justify-center rounded-[7px] border transition ${
                  rememberMe
                    ? "border-[#0b2b5d] bg-[#0b2b5d]"
                    : "border-[#d1d3d6] bg-[#e8e8e8]"
                }`}
              >
                {rememberMe && (
                  <Check size={14} strokeWidth={3} className="text-white" />
                )}
              </button>

              <span className="text-[14px] font-semibold text-[#414751]">
                Remember me
              </span>
            </label>

            <Link href={"/forgotpassword"} className="cursor-pointer">
              <button
                type="button"
                className="text-[14px] font-medium text-[#5591c8] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </Link>
          </div>

          {/* Login */}
          <button
            disabled={loading}
            type="submit"
            className="mt-[58px] flex items-center justify-center gap-3 py-3 w-full rounded-[10px] bg-[#082a5d] text-[16px] font-medium text-white transition hover:bg-[#0a326d] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : ""}
            {loading ? "Logging in" : "Login"}
          </button>
        </form>
        {/* modal popup */}
        <Accessdenied
          isOpen={isSuccessmodalopen}
          onClose={() => setIssuccessmodalopen(false)}
        />

        {/* OR */}
        <div className="my-[58px] flex items-center gap-5">
          <div className="h-px flex-1 bg-[#e2e3e5]" />

          <span className="text-[13px] font-medium text-[#555c66]">OR</span>

          <div className="h-px flex-1 bg-[#e2e3e5]" />
        </div>

        {/* Microsoft */}
        <button
          type="button"
          className="flex py-4 w-full justify-center items-center rounded-full bg-white px-8 text-left shadow-[0_1px_5px_rgba(0,0,0,0.02)] cursor-pointer gap-4"
        >
          <MicrosoftIcon />

          <span className="text-[14px] font-medium text-[#414751]">
            Continue with Microsoft
          </span>
        </button>

        {/* Google */}
        <button
          type="button"
          className="mt-[34px] flex justify-center py-3 w-full items-center rounded-full bg-white px-8 text-left shadow-[0_1px_5px_rgba(0,0,0,0.02)] cursor-pointer gap-4"
        >
          <FcGoogle size={25} />

          {/* Kept exactly as shown in the reference */}
          <span className=" text-[14px] font-medium text-[#414751] ">
            Continue with Google
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
      <Image
        src="/axiomlogo.svg"
        alt="AxiomVault"
        width={150}
        height={30}
        className="mt-[23px]"
      />
    </div>
  );
}

/* ---------------- Microsoft Icon ---------------- */

function MicrosoftIcon() {
  return (
    <div className="grid h-[20px] w-[20px] grid-cols-2 grid-rows-2 gap-[2px]">
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
    <div className="flex h-[30px] w-[30px] items-center justify-center"></div>
  );
}
