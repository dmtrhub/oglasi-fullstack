import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('OGLASI - Online Ads Platform API')
    .setDescription(
      `
      ### REST API Documentation for OGLASI - Full Stack Online Ads Application  
      **Version:** 1.0  
      **OAS:** 3.0  

      #### Features:  
      - User authentication (JWT)  
      - Ad creation, filtering, and management  
      - Categories and search functionality  
      - Image uploads for ads  

      [GitHub Repository](https://github.com/dmtrhub/oglasi-fullstack) | [Postman Collection](#)  
    `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'JWT-auth', // Argument of @ApiBearerAuth() in controllers
    )
    .addTag('Users', 'User registration, login, and profile management')
    .addTag('Auth', 'Authentication and JWT token handling')
    .addTag('Ads', 'Advertisements (create, read, update, delete)')
    .addTag('Categories', 'Ad categories and filters')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
void bootstrap();
