import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

import { UserService } from '@app/user/user.service';
import { IExpressRequest } from '@app/types/expressRequest.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, process.env.JWT_SECRET) as JwtPayload;
      const user = await this.userService.findUserById(decode.id);

      req.user = user;

      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
