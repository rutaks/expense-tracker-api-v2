import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenExistsGuard implements CanActivate {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    /* istanbul ignore next */
    const authorizationProperty = context.switchToHttp().getRequest().headers
      ?.authorization;
    if (!authorizationProperty) {
      return true;
    }
    const token = authorizationProperty.replace('Bearer ', '');
    const auth = await this.authRepository.findOne({
      where: {
        accessToken: token,
      },
    });
    if (!auth) {
      throw new UnauthorizedException('Token not valid');
    }
    return true;
  }
}
