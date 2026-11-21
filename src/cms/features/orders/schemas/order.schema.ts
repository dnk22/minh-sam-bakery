import { z } from "zod";

export const orderStatusSchema = z.enum(["PENDING_CONFIRMATION", "REJECTED", "CONFIRMED", "NEED_CALLBACK", "COMPLETED"]);
export const updateOrderStatusSchema = z.object({ status: orderStatusSchema }).strict();
