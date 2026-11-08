"use client";

import { ArrowRight, ReceiptText } from "lucide-react";

// Future quotation integration attaches here; no submission is simulated.
const handleRequestQuotation = () => undefined;

export function QuotationActionButton({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return <button className="flex items-center gap-1.5 rounded bg-primary-container px-5 py-2.5 font-label-ui text-label-ui font-bold uppercase tracking-wider text-on-primary shadow transition-colors hover:bg-primary" onClick={handleRequestQuotation} type="button"><ReceiptText className="size-[18px]" /> YÊU CẦU BÁO GIÁ</button>;
  }

  return <button className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary-container px-6 py-3.5 font-label-ui text-label-ui uppercase tracking-wider text-on-primary shadow-md transition-all hover:bg-primary active:scale-[0.99]" onClick={handleRequestQuotation} type="button"><ReceiptText className="size-5 text-secondary-fixed" /><span className="font-bold">YÊU CẦU BÁO GIÁ</span><ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" /></button>;
}
