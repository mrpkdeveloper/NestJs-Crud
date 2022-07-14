import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //middleware for class validator , whitelist true means it will not allow user to pass on aditional info ... it will reject all extra info
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  await app.listen(3000);
}
bootstrap();
