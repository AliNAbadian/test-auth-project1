import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

/**
 * Bootstrap the application
 * @returns {Promise<void>} A promise that resolves when the application is fully bootstrapped
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Online Shop API')
    .setDescription(
      'Complete API documentation for the Online Shop application',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('User Panel', 'User panel - Profile, Orders, Dashboard')
    .addTag('Admin', 'Admin panel - User/Order/Product management (Admin only)')
    .addTag('User', 'User management endpoints')
    .addTag('Product', 'Product management endpoints')
    .addTag('Order', 'Order management endpoints')
    .addTag('Cart', 'Shopping cart endpoints')
    .addTag('Blog', 'Blog management endpoints')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: '/api-json',
    yamlDocumentUrl: '/api-yaml',
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: '*', // or your frontend domain
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(helmet({ hidePoweredBy: true }));

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
