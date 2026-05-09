import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita validación automática con los DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Habilita CORS para el frontend
  app.enableCors({ origin: 'http://localhost:5173' });

  // Configura Swagger
  const config = new DocumentBuilder()
    .setTitle('FitTrack Pro API')
    .setDescription('API REST para la plataforma FitTrack Pro')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Backend corriendo en http://localhost:3000`);
  console.log(`📚 Swagger docs en http://localhost:3000/api/docs`);
}
bootstrap();