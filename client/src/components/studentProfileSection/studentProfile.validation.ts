import { z } from "zod";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../../utils/common.validation";

export const studentProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must not be more than 50 characters" })
    .refine(
      (val) => {
        for (let i = 0; i < val.length; i++) {
          const char = val[i];
          const isEnglishLetter =
            (char >= "A" && char <= "Z") || (char >= "a" && char <= "z");
          const isSpace = char === " ";

          if (!isEnglishLetter && !isSpace) {
            return false;
          }
        }
        return true;
      },
      {
        message: "Name can only contain letters and spaces",
      },
    ),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must not be more than 15 digits" })
    .regex(/^[+0-9\s()-]+$/, {
      message: "Phone number can only contain numbers, spaces, +, -, (, )",
    }),
});

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;

export { changePasswordSchema, type ChangePasswordFormData };
