import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transform — рекомендуемая конфигурация для избежания проблем с массивами преобразований файлов
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
