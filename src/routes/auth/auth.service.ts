import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

import {
    RegisterDto,
    VerifyOtpDto,
} from './auth.dto';

import { AuthRepository } from './auth.repo';
import { RolesService } from './roles.service';

import { SharedUserRepository } from '../../shared/repositories/shared-user.repo';

import { HashingService } from '../../shared/services/hashing.service';

import { AUTH_CONSTANTS } from '../../shared/constants/auth.constant';

@Injectable()
export class AuthService {
    constructor(
        private readonly sharedUserRepository: SharedUserRepository,

        private readonly authRepository: AuthRepository,

        private readonly rolesService: RolesService,

        private readonly hashingService: HashingService,
    ) { }

    // =========================
    // REGISTER
    // =========================

    async register(body: RegisterDto) {

        // 1. Kiểm tra email
        const existingUser =
            await this.sharedUserRepository.findByEmail(
                body.email,
            );

        if (existingUser) {
            throw new ConflictException(
                'Email đã tồn tại',
            );
        }

        // 2. Lấy role USER
        const role =
            await this.rolesService.getUserRole();

        // 3. Hash password
        const password =
            await this.hashingService.hash(
                body.password,
            );

        // 4. Tạo User
        const user =
            await this.authRepository.createUser({
                email: body.email,
                password,
                name: body.name,
                phoneNumber: body.phoneNumber,

                roleId: role.id,

                status: 'INACTIVE',
            });

        // 5. Sinh OTP
        const otp = this.generateOtp();

        // 6. Thời gian hết hạn
        const expiresAt = new Date(
            Date.now() +
            AUTH_CONSTANTS.OTP_EXPIRES_IN,
        );

        // 7. Lưu OTP
        await this.authRepository.createVerificationCode({
            email: body.email,
            code: otp,
            type: 'REGISTER',
            expiresAt,
        });

        // TODO:
        // Sau này gửi OTP qua email
        console.log(
            `[REGISTER OTP] ${body.email}: ${otp}`,
        );

        // 8. Không trả password
        const {
            password: _password,
            ...safeUser
        } = user;

        return {
            message: 'Đăng ký thành công',
            data: safeUser,
        };
    }

    // =========================
    // VERIFY OTP
    // =========================

    async verifyOtp(body: VerifyOtpDto) {

        // 1. Tìm user
        const user =
            await this.sharedUserRepository.findByEmail(
                body.email,
            );

        if (!user) {
            throw new NotFoundException(
                'Tài khoản không tồn tại',
            );
        }

        // 2. Tìm OTP
        const verificationCode =
            await this.authRepository.findVerificationCode(
                body.email,
                'REGISTER',
            );

        if (!verificationCode) {
            throw new UnauthorizedException(
                'OTP không tồn tại hoặc đã được sử dụng',
            );
        }

        // 3. Kiểm tra OTP
        if (
            verificationCode.code !==
            body.code
        ) {
            throw new UnauthorizedException(
                'OTP không chính xác',
            );
        }

        // 4. Kiểm tra hết hạn
        if (
            verificationCode.expiresAt <
            new Date()
        ) {
            throw new UnauthorizedException(
                'OTP đã hết hạn',
            );
        }

        // 5. Active User
        const updatedUser =
            await this.authRepository.updateUserStatus(
                user.id,
                'ACTIVE',
            );

        // 6. Xóa OTP
        await this.authRepository.deleteVerificationCode(
            body.email,
            'REGISTER',
        );

        // 7. Không trả password
        const {
            password: _password,
            ...safeUser
        } = updatedUser;

        return {
            message: 'Xác thực OTP thành công',
            data: safeUser,
        };
    }

    // =========================
    // GENERATE OTP
    // =========================

    private generateOtp(): string {
        return Math.floor(
            100000 +
            Math.random() * 900000,
        ).toString();
    }
}