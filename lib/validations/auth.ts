import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
    email: z.string().email("유효한 이메일 주소를 입력해주세요."),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    confirmPassword: z
      .string()
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: "이용약관에 동의해야 합니다.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
