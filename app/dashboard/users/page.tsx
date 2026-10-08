import { PageTitle } from "../organisations/components/ui";
import UsersTable from "./components/UsersTable";
import { userStats } from "./data";

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <PageTitle
        title="Users"
        subtitle={`${userStats.total.toLocaleString()} users across ${userStats.organisations} organisations`}
      />
      <UsersTable />
    </div>
  );
}
