import { z } from "zod";
export const bulkReadSchema = z.object({ ids: z.array(z.string().trim().min(1)).optional(), all: z.boolean().optional() }).strict().superRefine((value, context) => {
  if (value.all !== true && !value.ids?.length) context.addIssue({ code: "custom", message: "Hãy chọn thông báo hoặc đánh dấu tất cả." });
});
