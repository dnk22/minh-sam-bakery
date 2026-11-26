"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { qrPaymentSchema } from "../schemas/qr-payment.schema";
import type { QrPaymentConfig } from "../types";
import { emptyQrPayment, readQrPaymentValue } from "../utils/qr-payment-data";
import type { SystemConfig } from "@/cms/features/system-configs/types";

export function useQrPaymentForm(config?: SystemConfig) {
  const form = useForm<QrPaymentConfig>({
    resolver: zodResolver(qrPaymentSchema),
    defaultValues: (config && readQrPaymentValue(config.value)) || emptyQrPayment(),
  });
  const [uploadPending, setUploadPending] = useState(false);
  return { form, uploadPending, setUploadPending };
}
