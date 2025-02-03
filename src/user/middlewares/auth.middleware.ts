import { IExpressRequest } from '@/types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization;

    try {
      const decode = verify(token, process.env.JWT_SECRET) as JwtPayload;
      const user = await this.userService.findById(decode.id);      
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
