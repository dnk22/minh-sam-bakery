import { connection } from "next/server";
import { DashboardPage } from "@/cms/features/dashboard/components/dashboard-page/dashboard-page";
import { getDashboardRange } from "@/cms/features/dashboard/lib/dashboard-date-range";

export default async function CmsDashboardPage() {
  await connection();
  return <DashboardPage initial={{ ...getDashboardRange("month"), topLimit: 10 }}/>;
}
