"use client";

import { useState } from "react";
import { AlertCircle, Wand2, X } from "lucide-react";
import { initials } from "../../../users/data";
import { TAKEN_USERNAMES, USERNAME_PATTERN, usernameSuggestions } from "../../data";
import { btnOutline, btnPrimary } from "../ui";
import Modal from "./Modal";

interface EditUsernameModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (username: string) => void;
  initial: string;
  fullName: string;
  department: string;
  jobTitle: string;
}

export default function EditUsernameModal(props: EditUsernameModalProps) {
  return (
    <Modal open={props.open} onClose={props.onClose} labelledBy="edit-username-title" className="max-w-sm">
      {/* Mounted only while open so the input starts from the current username */}
      <EditUsernameBody {...props} />
    </Modal>
  );
}

function EditUsernameBody({ onClose, onSave, initial, fullName, department, jobTitle }: EditUsernameModalProps) {
  const [value, setValue] = useState(initial);
  const username = value.trim().toLowerCase();

  const taken = username !== initial && TAKEN_USERNAMES.has(username);
  const badFormat = username.length > 0 && (!USERNAME_PATTERN.test(username) || username.length < 3);
  const error = taken ? "Username Already Exists" : badFormat ? "Invalid Username" : null;
  const canSave = username.length > 0 && !error;
  const suggestions = usernameSuggestions(fullName, department, TAKEN_USERNAMES);

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 pb-4 pt-5">
        <div>
          <h2 id="edit-username-title" className="text-lg font-semibold text-slate-900">
            Edit Username
          </h2>
          <p className="mt-1 text-xs text-slate-600">Choose a unique username for this administrator.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="text-slate-600 hover:text-slate-900">
          <X className="size-5" />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto px-5 py-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-slate-100 px-3 py-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0b2b5d] text-sm font-semibold text-white">
            {initials(fullName || "?")}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{fullName || "New administrator"}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-slate-600">
              {department && <span className="rounded bg-blue-100 px-1.5 py-px text-blue-800">{department}</span>}
              {jobTitle && <span>• {jobTitle}</span>}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="username-input" className="text-sm font-semibold text-slate-900">
              Username
            </label>
            {error && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-red-700">
                <AlertCircle className="size-3.5" aria-hidden="true" /> {error}
              </span>
            )}
          </div>
          <input
            id="username-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canSave && onSave(username)}
            aria-invalid={!!error}
            aria-describedby="username-hint"
            autoFocus
            className={`mt-2 h-10 w-full rounded-lg border px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
              error ? "border-red-700 focus:ring-red-100" : "border-slate-300 focus:border-[#0b2b5d] focus:ring-[#0b2b5d]/10"
            }`}
          />
          <p id="username-hint" className="mt-1.5 text-[11px] text-slate-600">
            Lowercase letters, numbers, dots or underscores. The username must be unique.
          </p>
        </div>

        {suggestions.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wide text-slate-600">Suggestions</p>
              <button
                type="button"
                onClick={() => setValue(suggestions[0])}
                className="flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:underline"
              >
                <Wand2 className="size-3.5" aria-hidden="true" /> Generate Username
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    s === username
                      ? "border-[#0b2b5d] bg-[#0b2b5d] text-white"
                      : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {taken && (
          <p role="alert" className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2.5 text-xs text-red-700">
            <AlertCircle className="mt-px size-4 shrink-0" aria-hidden="true" />
            The username {username} is currently unavailable.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 bg-slate-100 px-5 py-4">
        <button type="button" onClick={onClose} className={`${btnOutline} rounded-lg`}>
          Cancel
        </button>
        <button type="button" disabled={!canSave} onClick={() => onSave(username)} className={`${btnPrimary} rounded-lg`}>
          Save Username
        </button>
      </div>
    </>
  );
}
