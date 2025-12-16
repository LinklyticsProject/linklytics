import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { UserResponseDto } from '../auth/dto/user-response.dto';
import { TokenPayload } from './models/token-payload.model';

@Injectable()
export class TokenService {
  private readonly refreshTtlMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * สร้าง JWT access token สำหรับ user
   * @param user - User object ที่ต้องการสร้าง token
   * @returns JWT token string
   */
  async generateAccessToken(user: UserResponseDto): Promise<string> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
    };
    return await this.jwtService.signAsync(payload);
  }

  /**
   * สร้าง refresh token แบบ random, แฮชก่อนเก็บ DB และคืนค่า plaintext
   */
  async generateRefreshToken(
    userId: string,
    deviceInfo?: string,
  ): Promise<{ refreshToken: string; expiresAt: Date }> {
    const refreshToken = randomBytes(32).toString('hex');
    const hashedToken = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + this.refreshTtlMs);

    await this.prisma.userToken.create({
      data: {
        hashedToken,
        expiresAt,
        deviceInfo,
        userId,
      },
    });

    return { refreshToken, expiresAt };
  }

  /**
   * ใช้ refresh token เดิมเพื่อออกคู่ใหม่ (access + refresh) และ rotate token
   */
  async rotateRefreshToken(refreshToken: string): Promise<{
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const hashedToken = this.hashToken(refreshToken);
    const tokenRecord = await this.prisma.userToken.findUnique({
      where: { hashedToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const now = new Date();
    if (tokenRecord.expiresAt < now) {
      await this.prisma.userToken.delete({ where: { id: tokenRecord.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    const userResponse: UserResponseDto = {
      id: tokenRecord.user.id,
      email: tokenRecord.user.email,
      googleId: tokenRecord.user.googleId,
      createdAt: tokenRecord.user.createdAt,
      updatedAt: tokenRecord.user.updatedAt,
    };

    const accessToken = await this.generateAccessToken(userResponse);

    // เตรียม refresh token ใหม่
    const newRefreshToken = randomBytes(32).toString('hex');
    const newHashedToken = this.hashToken(newRefreshToken);
    const newExpiresAt = new Date(Date.now() + this.refreshTtlMs);

    // ทำเป็น transaction: ลบของเก่า + สร้างของใหม่
    await this.prisma.$transaction([
      this.prisma.userToken.delete({ where: { id: tokenRecord.id } }),
      this.prisma.userToken.create({
        data: {
          hashedToken: newHashedToken,
          expiresAt: newExpiresAt,
          deviceInfo: tokenRecord.deviceInfo ?? undefined,
          userId: tokenRecord.userId,
        },
      }),
    ]);

    return {
      user: userResponse,
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * เพิกถอน refresh token เดียว (ใช้ตอน logout)
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const hashedToken = this.hashToken(refreshToken);
    const existing = await this.prisma.userToken.findUnique({
      where: { hashedToken },
    });
    if (!existing) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.userToken.delete({
      where: { id: existing.id },
    });
  }

  /**
   * เพิกถอน refresh token ทั้งหมดของ user (ใช้สำหรับ logout all)
   */
  async revokeAllRefreshTokens(userId: string): Promise<void> {
    await this.prisma.userToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * สร้าง token payload จาก user data
   * @param user - User object
   * @returns Token payload object
   */
  createTokenPayload(user: UserResponseDto): TokenPayload {
    return {
      sub: user.id,
      email: user.email,
    };
  }

  /**
   * Verify และ decode JWT token
   * @param token - JWT token string
   * @returns Decoded token payload หรือ null ถ้า invalid
   */
  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token);
      return payload;
    } catch {
      return null;
    }
  }

  /**
   * Decode token โดยไม่ verify (ใช้สำหรับ debug)
   * @param token - JWT token string
   * @returns Decoded token payload หรือ null
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      return this.jwtService.decode<TokenPayload>(token);
    } catch {
      return null;
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
