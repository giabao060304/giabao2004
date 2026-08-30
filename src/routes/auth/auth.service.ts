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
import { EmailService } from '../../shared/services/email.service';
import { AuthRepository } from './auth.repo';
import { RolesService } from './roles.service';
import { LoginDto } from './auth.dto';
import { TokenService } from '../../shared/services/token.service';
import { SharedUserRepository } from '../../shared/repositories/shared-user.repo';

import { HashingService } from '../../shared/services/hashing.service';

import { AUTH_CONSTANTS } from '../../shared/constants/auth.constant';

@Injectable()
export class AuthService {
    constructor(
        private readonly sharedUserRepository: SharedUserRepository,
        private readonly tokenService: TokenService,
        private readonly authRepository: AuthRepository,

        private readonly rolesService: RolesService,

        private readonly hashingService: HashingService,
        private readonly emailService: EmailService,
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
        const userRoleId = await this.rolesService.getUserRoleId();
        // 3. Hash password
        const password =
            await this.hashingService.hash(
                body.password,
            );

        // 4. Tạo User

        const user = await this.authRepository.createUser({
            email: body.email,
            password,
            name: body.name,
            phoneNumber: body.phoneNumber,
            roleId: userRoleId,

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
        await this.emailService.sendOtpEmail(body.email, otp);

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
    // =========================
    // LOGIN
    // =========================

    async login(
        body: LoginDto,
        userAgent: string,
        ip: string,
    ) {
        // 1. Tìm user
        const user = await this.sharedUserRepository.findByEmail(body.email);

        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        // 2. Kiểm tra tài khoản đã kích hoạt chưa
        if (user.status !== 'ACTIVE') {
            throw new UnauthorizedException('Tài khoản chưa được kích hoạt');
        }

        // 3. So sánh password
        const isPasswordValid = await this.hashingService.compare(
            body.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        // 4. Tạo payload
        const payload = {
            userId: user.id,
            roleId: user.roleId,
        };

        // 5. Sinh token
        const accessToken = await this.tokenService.generateAccessToken(payload);
        const refreshToken = await this.tokenService.generateRefreshToken(payload);

        // 6. Tạo Device
        const device = await this.authRepository.createDevice({
            userId: user.id,
            userAgent,
            ip,
        });

        // 7. Lưu Refresh Token
        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 ngày
        );

        await this.authRepository.createRefreshToken({
            token: refreshToken,
            userId: user.id,
            deviceId: device.id,
            expiresAt,
        });

        // 8. Trả kết quả
        return {
            message: 'Đăng nhập thành công',
            data: {
                accessToken,
                refreshToken,
                user,
            },
        };
    }
    private generateOtp(): string {
        return Math.floor(
            100000 +
            Math.random() * 900000,
        ).toString();
    }
}