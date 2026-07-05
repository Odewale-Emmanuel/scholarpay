import { z } from "zod";

export const registerSchoolSchema = z
  .object({
    name: z.string().min(2, "School name must be at least 2 characters"),

    email: z.string().email("Enter a valid email address"),

    phone: z.string().min(7, "Phone number is too short"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterSchoolFormValues = z.infer<typeof registerSchoolSchema>;
