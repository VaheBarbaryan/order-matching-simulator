import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';

import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifyCompress from '@fastify/compress';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AuthServiceModule, new FastifyAdapter());
  const configService: ConfigService = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Register CORS
  await app.register(fastifyCors, {
    origin: configService.getOrThrow<string>('CORS_ORIGINS')?.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    credentials: true,
  });

  // Register Helmet for security headers
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  await app.register(fastifyCookie, {
    secret: configService.getOrThrow<string>('COOKIE_SECRET'),
  });

  // Register Compression
  await app.register(fastifyCompress, {
    encodings: ['gzip', 'deflate'],
  });

  const PORT = configService.get<number>('PORT') ?? 3000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`Server is up and running on port ${PORT}`);
}
bootstrap();
