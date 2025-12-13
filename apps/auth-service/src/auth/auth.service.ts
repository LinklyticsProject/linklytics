import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { PrismaService } from '../database/prisma.service';
import bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenService } from '../token/token.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  async registerUser(
    registerUserDto: RegisterUserDto,
  ): Promise<UserResponseDto> {
    const { email, password } = registerUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          googleId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation (email already exists)
        if (error.code === 'P2002') {
          throw new ConflictException('User with this email already exists');
        }
        // P2003: Foreign key constraint failed
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid reference data');
        }
      }
      // P2000: Value too long, P2001: Record not found, etc.
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid input data');
      }
      // Unknown errors - log and throw generic error
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = loginUserDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      googleId: user.googleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const accessToken =
      await this.tokenService.generateAccessToken(userResponse);
    const { refreshToken } = await this.tokenService.generateRefreshToken(
      userResponse.id,
    );

    return {
      accessToken,
      refreshToken,
      user: userResponse,
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponseDto> {
    const { user, accessToken, refreshToken } =
      await this.tokenService.rotateRefreshToken(refreshTokenDto.refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshTokenDto.refreshToken);
  }

  async logoutAll(user: UserResponseDto): Promise<void> {
    await this.tokenService.revokeAllRefreshTokens(user.id);
  }
}
