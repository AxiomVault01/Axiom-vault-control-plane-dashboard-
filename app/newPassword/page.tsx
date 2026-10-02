"use client";

import { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* ---------- Icons ---------- */

const LockIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="10" width="16" height="11" rx="3" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="15.5" r="1.2" fill="#fff" />
  </svg>
);

const EyeIcon = ({ off }: { off: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1F2937"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {off ? (
      <>
        <path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.39-1.61" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <path d="M2 2l20 20" />
      </>
    ) : (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const InfoIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#B95C1E"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill={filled ? "#B95C1E" : "#F1DFD0"}
  >
    <path d="M12 2l2.94 6.26 6.86.78-5.1 4.68 1.4 6.78L12 17.1 5.9 20.5l1.4-6.78-5.1-4.68 6.86-.78L12 2z" />
  </svg>
);

const CheckIcon = ({ met }: { met: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill={met ? "#B95C1E" : "#EED6C3"} />
    <path
      d="M7 12.5l3.2 3.2L17 9"
      fill="none"
      stroke="#fff"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- Pieces ---------- */

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-[9px] flex items-center gap-[5px] text-[9px] leading-none text-[#B95C1E]">
      <InfoIcon />
      {children}
    </p>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  defaultVisible = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  defaultVisible?: boolean;
}) {
  const [visible, setVisible] = useState(defaultVisible);
  return (
    <div>
      <label className="mb-[6px] block text-[11px] font-medium leading-none text-[#374151]">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[30px] w-full rounded-[6px] border border-[#D9D9D9] bg-white pl-[18px] pr-10 text-[11px] text-[#111827] outline-none focus:border-[#0A1F44]"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-[18px] top-1/2 -translate-y-1/2"
        >
          <EyeIcon off={!visible} />
        </button>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

/* ---------- Page ---------- */

const STRENGTH = [
  { stars: 0, label: "" },
  { stars: 1, label: "Weak" },
  { stars: 1, label: "Weak" },
  { stars: 2, label: "Fair" },
  { stars: 4, label: "Good" },
  { stars: 5, label: "Strong" },
];

export default function CreatePasswordPage() {
  const [tempPassword, setTempPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [tempError, setTempError] = useState("");
  const [loading, setLoading] = useState(false);

  const rules = [
    { label: "12+ characters", met: password.length >= 12 },
    { label: "Uppercase letters", met: /[A-Z]/.test(password) },
    { label: "Lowercase letters", met: /[a-z]/.test(password) },
    { label: "Numbers", met: /\d/.test(password) },
    { label: "Special characters", met: /[^A-Za-z0-9]/.test(password) },
  ];
  const metCount = rules.filter((r) => r.met).length;
  const strength = STRENGTH[metCount];
  const allMet = metCount === rules.length;
  const mismatch = confirm.length > 0 && confirm !== password;

  const handleChangePassword = async () => {
    // TODO: replace with your API call to verify the temporary password
    const ok = tempPassword.length > 0;
    setTempError(ok ? "" : "Incorrect temporary password");
    if (!ok || !allMet || mismatch) return;
    // submit...

  };

  return (
    <main className={`${inter.className} min-h-screen bg-white p-3`}>
      <div className="w-[478px] rounded-[16px] bg-[#F4F4F4] px-[18px] pb-[22px] pt-[20px]">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-[#0A1F44]">
            <LockIcon />
          </div>
          <Image
            src="/axiomvault-logo.png"
            alt="AxiomVault"
            width={106}
            height={30}
            className="mt-[23px]"
          />
          <h1 className="mt-[27px] text-[20px] font-bold leading-none text-[#111827]">
            Create New Password
          </h1>
          <p className="mt-[19px] text-[10px] leading-none text-[#374151]">
            Create a secured password for your administrator account.
          </p>
        </div>

        {/* Fields */}
        <form onSubmit={handleChangePassword}>
          <div className="mt-[40px]">
            <PasswordField
              label="Enter Temporary Password"
              value={tempPassword}
              onChange={setTempPassword}
              error={tempError}
            />
          </div>
          <div className="mt-[25px]">
            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              error={
                password && !allMet ? "Password must meet all requirements" : ""
              }
            />
          </div>
          {/* Strength */}
          <div className="mt-[28px]">
            <div className="flex items-center justify-between">
              <div className="flex gap-[2px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <StarIcon key={i} filled={i < strength.stars} />
                ))}
              </div>
              <span className="text-[8px] font-bold uppercase leading-none text-[#B95C1E]">
                {strength.label}
              </span>
            </div>
            <ul className="mt-[11px] grid grid-cols-2 gap-x-[16px] gap-y-[9px]">
              {rules.map((r) => (
                <li
                  key={r.label}
                  className={`flex items-center gap-[5px] text-[8.5px] leading-[10px] ${r.met ? "text-[#B95C1E]" : "text-[#D9AE8E]"}`}
                >
                  <CheckIcon met={r.met} />
                  {r.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-[25px]">
            <PasswordField
              label="Confirm Password"
              value={confirm}
              onChange={setConfirm}
              defaultVisible
              error={mismatch ? "Password do not match" : ""}
            />
          </div>
          {/* Actions */}
          <div className="mt-[30px] grid grid-cols-2 gap-[12px]">
            <button
              type="button"
              className="h-[26px] rounded-[4px] bg-[#0A1F44] text-[10px] font-medium text-white"
            >
              Skip
            </button>
            <button
              disabled={loading}
              type="button"
              className="h-[26px] rounded-[4px] bg-[#0A1F44] text-[10px] font-medium text-white"
            >
                {loading ? "" : ""}
              {loading ? "Creating Password..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
