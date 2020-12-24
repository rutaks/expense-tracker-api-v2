import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../../users/entities/user.entity';
import { Auth } from '../entities/auth.entity';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email, phoneNumber } = payload.user;
    const options = [];

    email && options.push({ email });
    phoneNumber && options.push({ phoneNumber });

    const account = await this.authRepo.findOne({
      where: options,
      relations: ['user'],
    });

    if (!account) {
      throw new UnauthorizedException(
        'Account is blocked, kindly contact your administrator for assistance',
      );
    }

    if (account?.isBlocked === true) {
      throw new UnauthorizedException('User was blocked');
    }

    if (account?.user?.isDisabled === true) {
      throw new UnauthorizedException('User is disabled');
    }

    return account.user;
  }
}
