import { redirect } from "next/navigation";

export default async function CmsOrdersIndex({
  searchParams,
}: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const values = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value !== undefined) query.set(key, value);
  }
  redirect(`/cms/orders/pending${query.size ? `?${query}` : ""}`);
}
