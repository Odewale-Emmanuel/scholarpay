import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  parentName: z.string().min(1, "Parent name is required"),
  parentPhone: z.string().min(10, "Valid parent phone required"),
  parentEmail: z.string().email("Invalid parent email"),
  grade: z.string().min(1, "Grade is required"),
  studentId: z.string().min(1, "Student ID is required"),
});

export const createFeeSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  title: z.string().min(1, "Fee title is required"),
  description: z.string().optional(),
  totalAmount: z.number().positive("Amount must be positive"),
  installmentCount: z.union([z.literal(2), z.literal(3)]),
  dueDate: z.string().min(1, "Due date is required"),
  academicSession: z.string().min(1, "Academic session is required"),
  term: z.string().min(1, "Term is required"),
});

export const installmentConfigSchema = z.object({
  installmentCount: z.union([z.literal(2), z.literal(3)]),
  firstDueDate: z.string().min(1, "First due date is required"),
  customSplit: z.boolean().optional(),
});

export const initiatePaymentSchema = z.object({
  feeRecordId: z.string().min(1, "Fee record is required"),
  installmentPlanId: z.string().min(1, "Installment is required"),
  amount: z.number().positive("Amount must be positive"),
  callbackUrl: z.string().url("Valid callback URL required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
export type CreateFeeFormValues = z.infer<typeof createFeeSchema>;
export type InstallmentConfigFormValues = z.infer<
  typeof installmentConfigSchema
>;
export type InitiatePaymentFormValues = z.infer<typeof initiatePaymentSchema>;
