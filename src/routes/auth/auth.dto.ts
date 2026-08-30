import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z
        .string()
        .email('Email không hợp lệ'),

    password: z
        .string()
        .min(6, 'Password phải có ít nhất 6 ký tự'),

    name: z
        .string()
        .min(1, 'Tên không được để trống'),

    phoneNumber: z
        .string()
        .min(10, 'Số điện thoại không hợp lệ')
        .max(15, 'Số điện thoại không hợp lệ'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;


export const VerifyOtpSchema = z.object({
    email: z
        .string()
        .email('Email không hợp lệ'),

    code: z
        .string()
        .length(6, 'OTP phải có 6 chữ số')
        .regex(/^\d+$/, 'OTP chỉ được chứa số'),
});

export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;


export const LoginSchema = z.object({
    email: z
        .string()
        .email('Email không hợp lệ'),

    password: z
        .string()
        .min(1, 'Password không được để trống'),
});

export type LoginDto = z.infer<typeof LoginSchema>;