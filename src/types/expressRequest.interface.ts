import { UserEntity } from '@/user/user.entity';
import { Request } from 'express';

export interface IExpressRequest extends Request {
    user?: UserEntity
}