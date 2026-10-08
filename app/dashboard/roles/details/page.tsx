import { Suspense } from "react";
import RoleDetails from "../components/RoleDetails";

// RoleDetails reads ?role= so it renders on the client inside Suspense
export default function RoleDetailsPage() {
  return (
    <Suspense fallback={null}>
      <RoleDetails />
    </Suspense>
  );
}
