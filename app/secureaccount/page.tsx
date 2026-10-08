"use client";

import { useEffect, useRef, useState } from "react";
import { Loader, ShieldCheck } from "lucide-react";
import Image from "next/image";
import SecureModal from "../components/modals/securemodal";
import Link from "next/link";
// import { QRCodeSVG } from "qrcode.react";

export default function SecureAccountPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSuccessmodalopen, setIssuccessmodalopen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    const number = value.replace(/\D/g, "");

    if (!number) {
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);
      return;
    }

    // If user pastes/types multiple characters into one box
    if (number.length > 1) {
      const digits = number.slice(0, 6).split("");
      const updatedOtp = [...otp];

      digits.forEach((digit, i) => {
        if (index + i < 6) {
          updatedOtp[index + i] = digit;
        }
      });

      setOtp(updatedOtp);

      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();

      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = number;

    setOtp(updatedOtp);

    // Move to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updatedOtp = [...otp];
        updatedOtp[index] = "";
        setOtp(updatedOtp);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();

        const updatedOtp = [...otp];
        updatedOtp[index - 1] = "";
        setOtp(updatedOtp);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const digits = pastedValue.split("");
    const updatedOtp = ["", "", "", "", "", ""];

    digits.forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    inputRefs.current[Math.min(digits.length, 6) - 1]?.focus();
  };

  const verificationCode = otp.join("");

  const handleEnableMFA = async () => {
    if (verificationCode.length !== 6) {
        alert("Please enter the 6-digit verification code.");
    }
    console.log("Verification code:", verificationCode);
    setLoading(true);
    try {
        // Submit OTP to your API here
        setIssuccessmodalopen(true);
    } catch (err) {
      console.error(err);
    } finally {
    //   setIssuccessmodalopen(false);
      setLoading(false);
    }
    
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-4 py-8 sm:px-6 md:py-10">
      <div className="mx-auto w-full max-w-[720px]">
        {/* Header */}
        <div className="text-center">
          {/* Security Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0b2d61] sm:h-20 sm:w-20">
            <ShieldCheck size={48} strokeWidth={1.6} className="text-white" />
          </div>

          {/* Logo */}
          <div className="mt-[20px] flex justify-center">
            <AxiomVaultLogo />
          </div>

          {/* Heading */}
          <h1 className="mt-[42px] text-[30px] font-bold tracking-[-0.7px] text-[#101828] sm:text-[32px]">
            Secure Your Account
          </h1>

          <p className="mt-[18px] text-[16px] text-[#343b46] sm:text-[17px]">
            Enable Multi-Factor Authentication to protect your administrator
            account.
          </p>
        </div>

        {/* Content */}
        <div className="mt-[52px] space-y-5">
          {/* Step 1 */}
          <section className="rounded-[10px] bg-white px-6 py-[23px] shadow-[0_2px_8px_rgba(0,0,0,0.025)] sm:px-7">
            <StepHeader number="1" title="Install an authenticator app" />

            <p className="ml-[43px] mt-1 text-[14px] text-[#69717c]">
              Google Authenticator, Authy, or Microsoft Authenticator
            </p>
          </section>

          {/* Step 2 */}
          <section className="rounded-[10px] bg-white px-6 py-[22px] shadow-[0_2px_8px_rgba(0,0,0,0.025)] sm:px-7">
            <StepHeader number="2" title="Scan this QR code" />

            <p className="ml-[43px] mt-1 text-[14px] text-[#69717c]">
              Open your authenticator app and scan the QR code to add your
              AxiomVault account.
            </p>

            {/* QR Code */}
            <div className="mt-[38px] flex justify-center pb-[10px]">
              {/* <QRCodeSVG
                value="otpauth://totp/AxiomVault:admin@company.com?secret=JBSWY3DPEHPK3PXP&issuer=AxiomVault"
                size={235}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              /> */}
            </div>
          </section>

          {/* Step 3 */}
          <section className="rounded-[10px] bg-white px-6 py-[20px] sm:px-7">
            <StepHeader number="3" title="Enter 6-digit verification code" />

            {/* OTP */}
            <div className="ml-[43px] mt-[13px] flex gap-[7px]">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  aria-label={`OTP digit ${index + 1}`}
                  className="
                    h-[38px]
                    w-[38px]
                    rounded-[6px]
                    border
                    border-[#aeb4bc]
                    bg-[#f4f5f6]
                    text-center
                    text-[17px]
                    font-medium
                    text-[#1d2733]
                    outline-none
                    transition
                    focus:border-[#0b2d61]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#0b2d61]/15
                    sm:h-[40px]
                    sm:w-[40px]
                  "
                />
              ))}
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="mt-[42px] grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/login"
            className="
                py-3
                  rounded-[7px]
                  border
                  border-[#7f8995]
                  bg-white
                  text-[14px]
                  font-medium
                  text-[#343b46]
                  transition text-center
                  hover:bg-[#f5f6f7] cursor-pointer
                "
          >
            <button type="button">Skip</button>
          </Link>

          <button
            type="button"
            onClick={handleEnableMFA}
            className="
              rounded-[7px]
              bg-[#082d63]
              text-[14px]
              font-medium
              text-white
              transition
              hover:bg-[#0b3978]
              disabled:cursor-not-allowed
              disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2
            "
            disabled={verificationCode.length !== 6 || loading}
          >
            {loading ? <Loader size={20} className="animate-spin" /> : ""}
            {loading ? "Enabling MFA..." : "Enable MFA"}
          </button>
        </div>
        <SecureModal
          isOpen={isSuccessmodalopen}
          onClose={() => setIssuccessmodalopen(false)}
        />
      </div>
    </main>
  );
}

/* -------------------------------- */
/* Step Header                      */
/* -------------------------------- */

function StepHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-full bg-[#0b2d61] text-[14px] font-semibold text-white">
        {number}
      </div>

      <h2 className="text-[16px] font-medium text-[#202833]">{title}</h2>
    </div>
  );
}

/* -------------------------------- */
/* AxiomVault Logo                  */
/* -------------------------------- */

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
