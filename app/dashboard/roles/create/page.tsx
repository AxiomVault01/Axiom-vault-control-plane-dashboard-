import { Suspense } from "react";
import CreateRoleForm from "../components/CreateRoleForm";

// CreateRoleForm reads ?draft= to resume a saved draft, so it renders inside Suspense
export default function CreateRolePage() {
  return (
    <Suspense fallback={null}>
      <CreateRoleForm />
    </Suspense>
  );
}
