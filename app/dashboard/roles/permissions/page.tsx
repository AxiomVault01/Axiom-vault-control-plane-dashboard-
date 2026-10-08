import { Suspense } from "react";
import PermissionMatrix from "../components/PermissionMatrix";

// PermissionMatrix reads ?role= so it renders on the client inside Suspense
export default function PermissionMatrixPage() {
  return (
    <Suspense fallback={null}>
      <PermissionMatrix />
    </Suspense>
  );
}
