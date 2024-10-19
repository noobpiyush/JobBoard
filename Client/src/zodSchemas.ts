import z from "zod";

export const SignupBody = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Invalid email address"),
  password: z.string().min(6, "Min 6 length"),
});

// Zod schema for user signin body validation
export const SigninBody = z.object({
  companyEmail: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const VeVerificationBody = z.object({
  otp:z.string().length(4),
})
