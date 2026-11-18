import { CmsSessionRefresh } from "@/cms/features/auth/components/session-refresh";
import { sanitizeCmsRedirect } from "@/cms/features/auth/lib/redirect";

export const instant = false;

export default async function CmsSessionRefreshPage({ searchParams }: PageProps<"/cms/session-refresh">) {
  const params = await searchParams;
  return <CmsSessionRefresh locked={params.reason === "locked"} redirectTo={sanitizeCmsRedirect(params.redirect)} />;
}
