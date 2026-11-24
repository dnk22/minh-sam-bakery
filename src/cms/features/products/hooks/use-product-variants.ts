"use client";

import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form";
import { MAX_PRODUCT_VARIANTS } from "../lib/product-collection-utils";
import type { ProductFormValues } from "../types";

export function useProductVariants(form: UseFormReturn<ProductFormValues>) {
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: "variants" });
  const variants = useWatch({ control: form.control, name: "variants" });
  const status = useWatch({ control: form.control, name: "status" });
  const add = () => {
    if (form.getValues("variants").length >= MAX_PRODUCT_VARIANTS) return;
    append({ sku: "", size: "", style: "", price: form.getValues("price"), salePrice: "", status: "ACTIVE", sortOrder: fields.length });
  };
  return { fields, add, remove, move, atLimit: fields.length >= MAX_PRODUCT_VARIANTS, publishedWithoutActive: status === "PUBLISHED" && !variants.some(variant => variant.status === "ACTIVE") };
}
