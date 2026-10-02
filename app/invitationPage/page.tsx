"use client";
import { Check, Info, Mail } from "lucide-react";
import Image from "next/image";

export default function InvitationPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] px-5 py-8 font-sans text-[#111827]">
      <div className="mx-auto w-full max-w-[1024px] rounded-[24px] border border-[#e7e9ed] bg-white px-8 py-8 shadow-[0_1px_4px_rgba(0,0,0,0.03)] sm:px-12 sm:py-10 md:px-[60px]">
        {/* Mail Icon */}
        <div className="flex justify-center">
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#0d2b5c]">
            <Mail size={46} strokeWidth={1.8} className="text-white" />
          </div>
        </div>

        {/* Logo */}
        <div className="mt-[55px] flex justify-center">
          <div className="flex items-center gap-[6px]">
            {/* AxiomVault logo mark */}
            <div className="relative h-[46px] w-[43px]">
              <div className="absolute left-[5px] top-0 h-[30px] w-[22px] rotate-[20deg] rounded-[5px] border-[7px] border-[#c36a1c] border-b-0" />
              <div className="absolute bottom-[3px] left-0 h-[18px] w-[38px] rotate-[8deg] rounded-[50%] border-[7px] border-[#123b69] border-t-0" />
            </div>

            <div className="mt-[55px] flex justify-center">
              <Image
                src="/axiomvault-logo.png"
                alt="AxiomVault"
                className="h-auto w-[215px] object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 h-px max-w-[365px] bg-[#e9eaed]" />

        {/* Heading */}
        <h1 className="mt-9 text-center text-[36px] font-bold leading-[1.2] tracking-[-1.1px] text-[#101827] sm:text-[38px]">
          You're Invited to Join AxiomVault
        </h1>

        {/* Description */}
        <p className="mx-auto mt-7 max-w-[690px] text-center text-[20px] leading-[1.45] text-[#4b5563]">
          Sarah Chen has invited you to join the AxiomVault Admin Control Panel
          as a{" "}
          <span className="font-bold text-[#111827]">
            Fraud Analyst Administrator.
          </span>
        </p>

        {/* Information Card */}
        <div className="mx-auto mt-[58px] max-w-[900px] rounded-[24px] bg-[#eeeeee] px-8 py-7 sm:px-9">
          <div className="space-y-[25px] text-[18px]">
            <InfoRow label="Organisation:" value="Meridian Financial Group" />

            <InfoRow
              label="Invited By:"
              value="Sarah Chen (sarah.chen@axiomvault.io)"
            />

            <InfoRow
              label="Assigned Role:"
              value="Fraud Analyst Administrator"
            />

            <InfoRow label="Temporary Password:" value="HB!vLp93@QrY" strong />

            <InfoRow label="Expires:" value="Jul 31, 2026 at 17:00 UTC" />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-[56px] flex justify-center">
          <button
            type="button"
            className="flex h-[64px] items-center gap-3 rounded-[8px] bg-[#0d2b5c] px-[30px] text-[18px] font-semibold text-white shadow-sm transition hover:bg-[#102f65]"
          >
            <span className="flex h-[23px] w-[23px] items-center justify-center rounded-[5px] bg-white">
              <Check size={16} strokeWidth={3} className="text-[#0d2b5c]" />
            </span>
            Accept Invitation
          </button>
        </div>

        {/* Invite Link */}
        <p className="mt-8 text-center text-[18px] leading-7 text-[#4b5563]">
          Or copy this link:{" "}
          <span className="break-all text-[#b45d1b]">
            https://app.axiomvault.io/invite/axv_inv_8f3k2p9q
          </span>
        </p>

        {/* Security Notice */}
        <div className="mx-auto mt-[58px] flex max-w-[900px] gap-4 rounded-[10px] border border-[#c8d2ff] bg-[#e2e7ff] px-5 py-[17px]">
          <div className="pt-[2px]">
            <Info size={27} strokeWidth={2} className="text-[#24518b]" />
          </div>

          <div>
            <p className="text-[16px] font-bold text-[#16427c]">
              Security notice
            </p>

            <p className="mt-1 text-[15px] leading-6 text-[#28538b]">
              This invitation expires in 72 hours. Never share this link.
              AxiomVault will never ask for your credentials via email.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-[15px] leading-6 text-[#777f8c]">
          Please note that password can only be changed after you accept
          Invitation. To change Password,{" "}
          <button
            type="button"
            className="text-[#b45d1b] underline underline-offset-2"
          >
            click here
          </button>
        </p>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="grid grid-cols-[225px_1fr] gap-5">
      <span className="text-[#68707d]">{label}</span>

      <span
        className={
          strong ? "font-bold text-[#111827]" : "font-semibold text-[#202633]"
        }
      >
        {value}
      </span>
    </div>
  );
}