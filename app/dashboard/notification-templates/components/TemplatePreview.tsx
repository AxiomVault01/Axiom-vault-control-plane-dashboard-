import { Fragment } from "react";
import { fillVariables, type Channel, type TemplateContent } from "../data";

// Renders **bold** inside a line
function Line({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

export default function TemplatePreview({ channel, content }: { channel: Channel; content: TemplateContent }) {
  const body = fillVariables(content.body);

  if (channel === "sms") {
    return (
      <div className="mx-auto max-w-xs rounded-3xl border-8 border-slate-800 bg-slate-100 p-4">
        <p className="text-center text-[11px] text-slate-500">{content.fromName || "Sender"}</p>
        <p className="mt-3 w-fit max-w-full rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-slate-900 shadow-sm">{body}</p>
      </div>
    );
  }

  if (channel === "webhook") {
    return (
      <div className="space-y-3">
        <p className="font-mono text-xs text-slate-700">
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700">POST</span> {content.subject || "—"}
        </p>
        <pre className="overflow-x-auto rounded-lg bg-[#1e2f52] p-4 text-xs leading-relaxed text-emerald-400">{body}</pre>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <dl className="space-y-1 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs">
        <div className="flex gap-2">
          <dt className="w-14 text-slate-500">From</dt>
          <dd className="text-slate-900">{content.fromName || "—"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-14 text-slate-500">Subject</dt>
          <dd className="font-medium text-slate-900">{fillVariables(content.subject) || "—"}</dd>
        </div>
      </dl>
      <div className="space-y-0 whitespace-pre-wrap break-words px-4 py-4 text-sm leading-relaxed text-slate-800">
        {body.split("\n").map((line, i) => (
          <p key={i} className="min-h-[1lh]">
            <Line text={line} />
          </p>
        ))}
      </div>
      <p className="border-t border-slate-200 px-4 py-2 text-[11px] text-slate-500">Preview uses sample values for variables.</p>
    </div>
  );
}
