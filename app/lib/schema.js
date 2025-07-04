
import {z} from "zod";
export const accountSchema =z.object({
    name: z.string().min(1, "Name is a required field"),
    type: z.enum(["CURRENT", "SAVINGS"]),
    balance: z.string().min(1, "Initial Balance is a required field"),
    isDefault: z.boolean().default(false),
});

export const tSchema =z.object({
    type: z.enum(["INCOME", "EXPENSE"]),    
    date: z.date({required_error: "Date is a required field"}),
    amount: z.string().min(1, "Initial Balance is a required field"),
    description: z.string().optional(),
    accountId: z.string().min(1, "Account ID is a required field"),
    category: z.string().min(1, "Category is a required field"),    
});