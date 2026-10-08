import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import OrgSummary from "../components/OrgSummary";
import OrgTabs from "../components/OrgTabs";
import { PageTitle } from "../components/ui";
import { getOrganisation } from "../data";

// Shared shell for every organisation detail tab
export default async function OrganisationLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const org = getOrganisation(orgId);
  if (!org) notFound();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageTitle
        title={org.name}
        subtitle="Manage all client organisations on the AxiomVault platform"
      />
      <OrgSummary plan={org.plan} />
      <OrgTabs orgId={org.id} />
      <div>{children}</div>
    </div>
  );
}
