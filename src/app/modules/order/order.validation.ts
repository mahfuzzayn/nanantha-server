import { z } from "zod";

const updateOrderStatusByAdminValidationSchema = z.object({
    body: z.object({
        status: z.string().optional(),
    }),
});

export const OrderValidations = {
    updateOrderStatusByAdminValidationSchema,
};
