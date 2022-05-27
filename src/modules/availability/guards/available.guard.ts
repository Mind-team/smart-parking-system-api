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
import {
  DatabaseInjectionToken,
  ICollection,
} from '../../../infrastructure/database';
import { MongoParkingOwner } from '../../mongo/schemas/parking-owner.schema';
import { EnvVariable } from '../../../infrastructure/environment';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AvailableGuard implements CanActivate {
  private req: any;

  constructor(
    @Inject(AuthInjectionToken.JwtService)
    private readonly jwtService: IJwtService,
    private readonly reflector: Reflector,
    @Inject(DatabaseInjectionToken.ParkingOwner)
    private readonly parkingOwnerDB: ICollection<MongoParkingOwner>,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.req = context.switchToHttp().getRequest();
    this.validateRequest();
    this.initGuardData();

    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    this.validateRoles(roles);

    if (
      roles.includes(Role.ModeratorCRM) &&
      'crm-moderator-key' in this.req.headers
    ) {
      const crmModeratorKey = this.configService.get(
        EnvVariable.CrmModeratorKey,
      );
      if (!crmModeratorKey) {
        throw new Error('В конфиге не указан ключ модераторов');
      }
      if (this.req.headers['crm-moderator-key'] === crmModeratorKey) {
        this.updateGuardData('isCrmModerator', true);
        return true;
      }
      throw new UnauthorizedException();
    }

    if (roles.includes(Role.ModeratorCRM) && roles.length < 2) {
      throw new BadRequestException('Не та роль');
    }

    if (roles.includes(Role.ParkingOwner) && roles.length > 1) {
      throw new InternalServerErrorException(
        'Несколько ролей с разными видами авторизациями',
      );
    }
    if (roles.includes(Role.ParkingOwner)) {
      return this.basicAuth();
    }
    return this.jwtAuth();
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

  private jwtAuth(): boolean {
    const token = this.req.headers.authorization.split(' ')[1];
    const decodedJwt = this.jwtService.decodeWithAccessToken(token);
    if (!decodedJwt.isValid) {
      throw new UnauthorizedException();
    }
    this.updateGuardData('isAuth', true);
    this.updateGuardData('decodedJwt', decodedJwt.data);
    return true;
  }

  private async basicAuth(): Promise<boolean> {
    if (
      !this.req.headers.authorization ||
      this.req.headers.authorization === ''
    ) {
      throw new BadRequestException('Нет данных для авторизации (basic)');
    }
    const b64auth = this.req.headers.authorization.split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64')
      .toString()
      .split(':');
    const parkingOwnerDocument = await this.parkingOwnerDB.findOne({
      login: username,
    });
    if (!parkingOwnerDocument) {
      throw new BadRequestException('Нет пользователя');
    }
    this.updateGuardData('decodedBasic', {
      login: parkingOwnerDocument.login,
      password: parkingOwnerDocument.password,
    });
    this.updateGuardData('isAuth', true);
    return parkingOwnerDocument.password === password;
  }
}
