import { IExpressRequest } from '@/types/expressRequest.interface';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IExpressRequest>();

    if (request.user) {
      return true;
    }

    throw new HttpException('Не авторизован', HttpStatus.UNAUTHORIZED);
  }
}
