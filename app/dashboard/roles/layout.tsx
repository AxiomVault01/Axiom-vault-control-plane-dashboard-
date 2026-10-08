import type { ReactNode } from "react";
import { RolesProvider } from "./RolesProvider";

// Every roles page shares one store so roles, drafts and permission edits stay in sync
export default function RolesLayout({ children }: { children: ReactNode }) {
  return (
    <RolesProvider>
      <div className="mx-auto max-w-8xl">{children}</div>
    </RolesProvider>
  );
}
