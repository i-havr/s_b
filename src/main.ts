import 'dotenv/config';

if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.enableCors(); // ще один варіант, як включити корс
  await app.listen(process.env.PORT);
}
bootstrap();
