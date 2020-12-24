import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto } from '../admins/dto/login-response.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ConfirmResetPasswordResponseDto,
  ResetPasswordResponseDto,
} from './dto/reset_response.dto';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { EmailPasswordLoginDto } from './email-password-login.dto';
import { ConfirmResetDto, ResetPasswordDto } from './dto/reset_password.dto';
import { GenericResponse } from '../shared/interfaces/generic-reponse.interface';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../shared/decorators/get-user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordMedium } from './enums/reset-password-medium.enum';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/admin')
  @ApiOkResponse({
    description: 'Admin authentication successful',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication failed',
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async loginAdmin(
    @Body() loginDto: EmailPasswordLoginDto,
  ): Promise<GenericResponse<LoginResponseDto>> {
    const results = await this.authService.loginAdmin(loginDto);
    return { message: 'Login Successful', results };
  }

  @Post('login/consumer')
  @ApiOkResponse({
    description: 'Consumer authentication successful',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication failed',
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async loginConsumer(
    @Body() loginDto: EmailPasswordLoginDto,
  ): Promise<GenericResponse<LoginResponseDto>> {
    const results = await this.authService.loginConsumer(loginDto);
    return { message: 'Consumer authentication successful', results };
  }

  @Post('password/reset')
  @ApiOkResponse({
    description: 'Password Reset successful',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication failed',
  })
  @ApiQuery({ name: 'medium', enum: ResetPasswordMedium })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async resetPassword(
    @Body() resetDto: ResetPasswordDto,
    @Query('medium') medium: string,
  ): Promise<GenericResponse<ResetPasswordResponseDto>> {
    const results = await this.authService.resetPassword(resetDto, medium);
    return {
      message: 'We have sent you a link to reset your password',
      results,
    };
  }

  @Patch('password/reset/:token')
  @ApiOkResponse({
    description: 'Password Reset successful',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication failed',
  })
  @ApiQuery({ name: 'medium', enum: ResetPasswordMedium })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async ConfirmresetPassword(
    @Body() resetDto: ConfirmResetDto,
    @Param('token') token: string,
    @Query('medium') medium: string,
  ): Promise<GenericResponse<ConfirmResetPasswordResponseDto>> {
    const results = await this.authService.confirmResetPassword(
      resetDto,
      token,
      medium,
    );
    return {
      message: 'Password reset successful!',
      results,
    };
  }

  @Post('/refresh-token')
  @ApiCreatedResponse({ description: 'Token created', type: User })
  @ApiNotFoundResponse({ description: 'Refresh token not found' })
  async refreshAccessToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<GenericResponse<{ accessToken: string }>> {
    const accessToken = await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );
    return { message: 'New access token generated', results: accessToken };
  }

  @Get('/me')
  @ApiOkResponse({ description: 'User found', type: User })
  @ApiUnauthorizedResponse({ description: 'User not found' })
  @UseGuards(AuthGuard())
  getPersonalInfo(@GetUser() user: User): GenericResponse<User> {
    return { message: 'User found', results: user };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User logged out', type: User })
  @ApiUnauthorizedResponse({ description: 'User not found' })
  @UseGuards(AuthGuard())
  async logoutUser(@GetUser() user: User): Promise<GenericResponse<User>> {
    await this.authService.logoutUser(user);
    return { message: 'User logged out successfully', results: user };
  }
}
