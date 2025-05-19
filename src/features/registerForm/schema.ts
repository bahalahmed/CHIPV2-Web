import * as z from "zod"

const phoneRegex = /^[6-9]\d{9}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/

export const RegisterFormSchema = z
  .object({
    mobileNumber: z
      .string()
      .regex(phoneRegex, "Enter a valid 10-digit mobile number starting with 6-9"),
    whatsappNumber: z
      .string()
      .regex(phoneRegex, "Enter a valid 10-digit WhatsApp number starting with 6-9"),
    email: z.string().email("Invalid email address"),

    stateId: z.string().min(1, "State is required"),
    divisionId: z.string().min(1),
    districtId: z.string().min(1),
    blockId: z.string().min(1),
    sectorId: z.string().min(1),
    organizationTypeId: z.string().min(1),
    designationId: z.string().min(1),

    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Use at least one uppercase letter & mix letters with numbers (min 6 characters)"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>
