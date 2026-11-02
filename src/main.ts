
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe.js';
import { TransformResponseInterceptor } from './interceptor/transform-response/transform-response.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validasi data yang masuk
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Mengatur format response API
  app.useGlobalInterceptors(
    new TransformResponseInterceptor(),
  );

  // Menjalankan server
  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
