import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { AuthInjectionToken, IJwtService } from '../../../infrastructure/auth';

@Injectable()
export class AvailableGuard implements CanActivate {
  private req: any;

  constructor(
    @Inject(AuthInjectionToken.JwtService)
    private readonly jwtService: IJwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    this.req = context.switchToHttp().getRequest();
    this.validateRequest();
    this.initGuardData();

    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    this.validateRoles(roles);

    const token = this.req.headers.authorization.split(' ')[1];
    const decodedJwt = this.jwtService.decodeWithAccessToken(token);
    if (!decodedJwt.isValid) {
      throw new UnauthorizedException();
    }
    this.updateGuardData('isAuth', true);
    this.updateGuardData('decodedJwt', decodedJwt.data);
    return true;
  }

  private initGuardData() {
    if (!this.req) {
      throw new Error('Нет запроса');
    }
    this.req.body['guardData'] = {};
    this.updateGuardData('isAuth', false);
    this.updateGuardData('decodedJwt', {});
  }

  private updateGuardData(key: string, value: any) {
    if (!this.req) {
      throw new Error('Нет запроса');
    }
    this.req.body['guardData'][key] = value;
  }

  private validateRequest() {
    if ('guardData' in this.req.body) {
      console.warn('Кто-то пытается подделать запрос \n', this.req.body);
      throw new BadRequestException();
    }
  }

  private validateRoles(roles: any) {
    if (!(Array.isArray(roles) && roles.length > 0)) {
      console.warn(
        'Нельзя использовать AvailableGuard без декоратора Available',
      );
      throw new InternalServerErrorException();
    }
  }
}
