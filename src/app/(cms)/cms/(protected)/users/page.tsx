import { Suspense } from "react";

import { UsersPage } from "@/cms/features/users/components/users-page/users-page";

export default function CmsUsersPage() {
  return <Suspense fallback={null}><UsersPage /></Suspense>;
}
