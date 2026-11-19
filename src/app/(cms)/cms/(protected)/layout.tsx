import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { CmsShell } from "@/cms/components/layout/cms-shell";
import { CmsSessionState } from "@/cms/features/auth/components/session-state";
import { CMS_REQUEST_PATH_HEADER } from "@/cms/features/auth/lib/constants";
import { cmsLoginUrl, sanitizeCmsRedirect } from "@/cms/features/auth/lib/redirect";
import { resolveCmsSession } from "@/cms/features/auth/session/current-session";
import { toCmsProfileUser } from "@/cms/features/auth/types";
import { CmsQueryProvider } from "@/cms/providers/query-provider";

export const instant = false;

export default async function ProtectedCmsLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const redirectTo = sanitizeCmsRedirect(requestHeaders.get(CMS_REQUEST_PATH_HEADER));
  const session = await resolveCmsSession();

  if (session.status === "unauthenticated") redirect(cmsLoginUrl(redirectTo));
  if (session.status === "needs_refresh") redirect(`/cms/session-refresh?redirect=${encodeURIComponent(redirectTo)}`);
  if (session.status === "locked") redirect(`/cms/session-refresh?redirect=${encodeURIComponent(redirectTo)}&reason=locked`);
  if (session.status === "forbidden") return <CmsSessionState kind="forbidden" />;
  if (session.status === "unavailable") return <CmsSessionState kind="unavailable" />;

  return (
    <CmsQueryProvider>
      <CmsShell user={toCmsProfileUser(session.user)}>{children}</CmsShell>
    </CmsQueryProvider>
  );
}
