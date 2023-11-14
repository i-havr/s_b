import { IExpressRequest } from '@app/types';
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

    if (request.user?.role.includes('admin')) {
      return true;
    }

    throw new HttpException(
      'You do not have permission to access this resource.',
      HttpStatus.FORBIDDEN,
    );
  }
}
