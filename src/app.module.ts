import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormconfig from '@app/ormconfig';

import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';

import { UserModule } from '@app/user/user.module';
import { KindergartenModule } from '@app/kindergarten/kindergarten.module';
import { ArticleModule } from '@app/article/article.module';
import { TagModule } from '@app/tag/tag.module';

import { AuthMiddleware, UpdateMiddleware } from '@app/user/middlewares';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule,
    UserModule,
    ArticleModule,
    KindergartenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(UpdateMiddleware)
      .forRoutes({ path: 'user', method: RequestMethod.PUT });
  }
}
