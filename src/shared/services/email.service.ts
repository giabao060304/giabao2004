import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly resend: Resend;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not defined');
        }

        this.resend = new Resend(apiKey);
    }

    async sendOtpEmail(email: string, otp: string) {
        const { data, error } = await this.resend.emails.send({
            from: 'Ecom App <onboarding@resend.dev>',
            to: [email],
            subject: 'Mã xác thực OTP đăng ký tài khoản',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Xác thực tài khoản</h2>
                    <p>Mã OTP của bạn là:</p>
                    <h1 style="letter-spacing: 4px;">${otp}</h1>
                    <p>Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
                </div>
            `,
        });

        if (error) {
            this.logger.error(`Gửi OTP thất bại: ${email}`, error);
            throw new Error('Không thể gửi email OTP');
        }

        this.logger.log(`OTP email sent to ${email}, id: ${data?.id}`);

        return data;
    }
}