import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { deleteNotAllowedProperties } from '@app/utils';
import { IExpressRequest } from '@app/types';

export const allowedPropertiesForUpdating = [
  'name',
  'additionalInfo',
  'image',
  'role',
  'kindergarten',
  'group',
  'password',
];

@Injectable()
export class UpdateMiddleware implements NestMiddleware {
  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    deleteNotAllowedProperties(allowedPropertiesForUpdating, req.body.user);

    next();
  }
}
