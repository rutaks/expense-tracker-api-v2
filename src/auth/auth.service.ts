/* istanbul ignore next */
import 'dotenv/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { ConfigService } from '@nestjs/config';
import { Auth } from './entities/auth.entity';
import { LoginResponseDto } from '../admins/dto/login-response.dto';
import { EmailPasswordLoginDto } from './email-password-login.dto';
import { User } from '../users/entities/user.entity';
import { ConfirmResetDto, ResetPasswordDto } from './dto/reset_password.dto';
import {
  accountBlockedTemplate,
  confirmresetTemplete,
  resetTemplete,
} from '../shared/templates/get-email-body';
import {
  ConfirmResetPasswordResponseDto,
  ResetPasswordResponseDto,
} from './dto/reset_response.dto';
import { Reset } from './entities/reset.entity';
import { ResetPasswordMedium } from './enums/reset-password-medium.enum';
import { canSendEmailOrSms } from '../shared/utils/environment.util';
import { Consumer } from 'src/consumer/entities/consumer.entity';
import { Admin } from 'src/admins/entities/admin.entity';

/**
 * Represents the Authentication service layer
 */
@Injectable()
export class AuthService {
  private support_team: string;
  private app_root: string;
  private node_env: string;
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    @InjectRepository(Reset)
    private readonly resetRepository: Repository<Reset>,
    private readonly jwtService: JwtService,
    private readonly sendGridService: SendGridService,
    private readonly configService: ConfigService,
  ) {
    this.support_team = this.configService.get<string>('SUPPORT_TEAM');
    this.app_root = this.configService.get<string>('APP_ROOT');
    this.node_env = this.configService.get<string>('NODE_ENV');
  }

  /**
   * Authenticates an admin by email & password
   *
   * @param EmailPasswordLoginDto - object representation of an login attempt
   * @returns LoginResponseDto Instance of admin with access token
   * @throws UnauthorizedException email must be found and password match
   */
  async loginAdmin(
    emailPasswordLoginDto: EmailPasswordLoginDto,
  ): Promise<LoginResponseDto> {
    const { email, password } = emailPasswordLoginDto;
    const auth = await this.authRepository.findOne({
      where: { email },
      relations: ['user'],
    });

    if (!(auth.user instanceof Admin)) {
      throw new UnauthorizedException('User not found!');
    }

    return await this.authenticateUser(auth, password);
  }

  /**
   * Authenticates an consumer by email & password
   *
   * @param EmailPasswordLoginDto - object representation of an login attempt
   * @returns LoginResponseDto Instance of consumer with access token
   * @throws UnauthorizedException email must be found and password match
   */
  async loginConsumer(
    emailPasswordLoginDto: EmailPasswordLoginDto,
  ): Promise<LoginResponseDto> {
    const { email, password } = emailPasswordLoginDto;
    const auth = await this.authRepository.findOne({
      where: { email },
      relations: ['user'],
    });

    if (!(auth.user instanceof Consumer)) {
      throw new UnauthorizedException('User not found!');
    }

    return await this.authenticateUser(auth, password);
  }

  /**
   * Generates JWT accessToken with user as token's signature
   *
   * @param user instance of existing user
   */
  private async generateToken(user: User) {
    const accessToken = this.jwtService.sign({ user });
    const refreshToken = await uuidv4();
    return { accessToken, refreshToken };
  }

  /**
   * Request for password Reset
   * @param resetDto - Object which contain only email for user
   * @throws - Error when user is not found
   * @returns - Object contain Url with token
   */
  async resetPassword(
    resetDto: ResetPasswordDto,
    medium = 'EMAIL',
  ): Promise<ResetPasswordResponseDto> {
    let queryOption;
    const { email, phoneNumber } = resetDto;

    if (ResetPasswordMedium[medium] === ResetPasswordMedium.EMAIL) {
      queryOption = { email };
    } else if (ResetPasswordMedium[medium] === ResetPasswordMedium.SMS) {
      queryOption = { phoneNumber };
    }

    const auth = await this.authRepository.findOne({
      where: queryOption,
      relations: ['user'],
    });

    if (!auth) {
      throw new UnauthorizedException('User not found!');
    }

    const token = this.jwtService.sign({ email: email });
    const url = `${this.app_root}/reset-password/${token}?medium=${medium}`;

    let resetInfo = await this.resetRepository.findOne({ where: { auth } });

    if (!resetInfo) {
      resetInfo = new Reset();
      resetInfo.auth = auth;
    }

    resetInfo.expiryDate = new Date();
    resetInfo.token = token;

    await this.resetRepository.save(resetInfo);
    /* istanbul ignore next */
    if (canSendEmailOrSms()) {
      if (ResetPasswordMedium[medium] === ResetPasswordMedium.EMAIL) {
        await this.sendGridService.send({
          to: email,
          from: this.support_team,
          subject: 'Reset password',
          html: resetTemplete(auth.user.firstName, url),
        });
      }
    }

    return { url, token };
  }

  /**
   * Confirm received email and change to new password
   * @param ReseDto - Object contains newPassword and confirm password
   * @param token - String which is token
   * @throws - Error when user do not found
   * @returns - Object user information
   */
  async confirmResetPassword(
    ReseDto: ConfirmResetDto,
    token: string,
    medium = 'EMAIL',
  ): Promise<ConfirmResetPasswordResponseDto> {
    let queryOption;
    const { newPassword } = ReseDto;
    const reset = await this.resetRepository.findOne({
      where: { token },
      relations: ['auth'],
    });

    if (!reset) {
      throw new UnauthorizedException('Invalid token!');
    }

    const now = new Date();

    if (ResetPasswordMedium[medium] === ResetPasswordMedium.EMAIL) {
      queryOption = { email: reset.auth.email };
    }

    const user = await this.authRepository.findOne({
      where: queryOption,
      relations: ['user'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    const resetVerify = await this.resetRepository.findOne({
      where: { auth: user.id },
    });

    if (!resetVerify) {
      throw new UnauthorizedException(
        'An error occured during reset password process, Please try again!',
      );
    }

    const hourDiff =
      Math.abs(now.getTime() - resetVerify.expiryDate.getTime()) / 6e4;

    /* istanbul ignore next */
    if (hourDiff > 60) {
      await this.resetRepository.delete(resetVerify.id);
      throw new UnauthorizedException(
        'Link is expired,  Please try to reset again!',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.authRepository.save({
      ...user,
      id: user.id,
      email: user.email,
      password: hashedPassword,
    });
    delete updatedUser.password;

    /* istanbul ignore next */
    if (canSendEmailOrSms()) {
      if (ResetPasswordMedium[medium] === ResetPasswordMedium.EMAIL) {
        await this.sendGridService.send({
          to: user.email,
          from: this.support_team,
          subject: 'Successfully Changed your password',
          html: confirmresetTemplete(user.user.firstName),
        });
      }
    }

    await this.resetRepository.delete(resetVerify.id);
    return { data: updatedUser };
  }

  /**
   * Confirms that user exists and compares similarity
   * between password submitted and existing password
   * @param auth - Auth existing or non-existing user's auth
   * @param password - String submitted by the client
   * @throws - Error when invalid email|username or password
   * @returns - Object user information, accessToken
   */
  async authenticateUser(
    auth: Auth,
    password: string,
  ): Promise<LoginResponseDto> {
    const errorMessage = 'Invalid username or password';
    if (!auth) {
      throw new UnauthorizedException(errorMessage);
    }

    if (auth?.isBlocked) {
      throw new UnauthorizedException(
        'Your account was blocked due to too many login attemps. Contact your admin for assistance',
      );
    }

    if (auth?.user?.isDisabled) {
      throw new UnauthorizedException('Your account was disabled');
    }

    const passwordMatch = await bcrypt.compare(password, auth.password);

    if (!passwordMatch) {
      await this.checkLoginAttempts(auth);
      throw new UnauthorizedException(errorMessage);
    }

    const { accessToken, refreshToken } = await this.generateToken(auth.user);
    auth.accessToken = accessToken;
    auth.refreshToken = refreshToken;
    await this.authRepository.save(auth);
    return { user: auth.user, accessToken, refreshToken };
  }

  /**
   * Logs user out by removing access token from DB
   * @param {Object} - logged in user object
   * @throws - Error when user do not found
   * @returns - Object user information
   */
  async logoutUser(user: User): Promise<Auth> {
    const { email } = user;
    const auth = await this.authRepository.findOne({ email });
    auth.refreshToken = '';
    auth.accessToken = '';
    this.authRepository.save(auth);
    return auth;
  }

  /**
   * Checks & registers amount of failed login attempts
   * blocks account after specific amount of failed attempts
   * @param auth - Auth existing or non-existing user's auth
   * @throws - Error when login attempts have been exceeded
   * @returns - Object account information
   */
  async checkLoginAttempts(auth: Auth): Promise<Auth> {
    const now = new Date();
    const errorMessage =
      'Your account was blocked due to too many login attemps. Contact your admin for assistance';
    const {
      lastFailedLoginAttempt,
      failedLoginAttempts,
      isBlocked,
      email,
    } = auth;

    if (isBlocked) {
      throw new UnauthorizedException(errorMessage);
    }

    if (failedLoginAttempts !== 0) {
      const hourDiff =
        Math.abs(now.getTime() - lastFailedLoginAttempt.getTime()) / 6e4;
      auth.lastFailedLoginAttempt = now;
      /* istanbul ignore next */
      if (hourDiff <= 120) {
        auth.failedLoginAttempts = failedLoginAttempts + 1;
        if (failedLoginAttempts >= 5) {
          auth.isBlocked = true;
          /* istanbul ignore next */
          if (canSendEmailOrSms()) {
            await this.sendGridService.send({
              to: email,
              from: process.env.SUPPORT_TEAM,
              subject: 'Account has been blocked :(',
              html: accountBlockedTemplate(auth.user.firstName),
            });
          }
          await this.authRepository.save(auth);
          throw new UnauthorizedException(errorMessage);
        }
      } else {
        /* istanbul ignore next */
        auth.failedLoginAttempts = 1;
      }
    } else {
      auth.failedLoginAttempts = failedLoginAttempts + 1;
      auth.lastFailedLoginAttempt = now;
    }
    return await this.authRepository.save(auth);
  }

  /**
   * Creates a new access token for a user,
   * replaces the previous access token
   * @param refreshToken - User's unique refresh token
   * @throws - Error when account with refresh token parsed is not found
   * @returns - Object holding new access token
   */
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const auth = await this.authRepository.findOne({
      where: { refreshToken },
      relations: ['user'],
    });
    if (!auth) {
      throw new UnauthorizedException(
        'Refresh token does not exist or expired',
      );
    }
    const { accessToken } = await this.generateToken(auth.user);
    auth.accessToken = accessToken;
    await this.authRepository.save(auth);
    return { accessToken };
  }
}
