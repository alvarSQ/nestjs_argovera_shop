import { IExpressRequest } from '@/types/expressRequest.interface';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IExpressRequest>();

    if (request.user) {
      if (request.user.role === 'admin') {
        return true;
      }
      throw new HttpException('Не админ', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('Не авторизован', HttpStatus.UNAUTHORIZED);
  }
}
