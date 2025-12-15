import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';

import fastifyCors from '@fastify/cors';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(ApiGatewayModule, new FastifyAdapter());

  const configService: ConfigService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 3000;

  // Register CORS
  await app.register(fastifyCors, {
    origin: configService.getOrThrow<string>('CORS_ORIGINS')?.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    credentials: true,
  });

  await app.listen(PORT, '0.0.0.0');
  console.log(`Server is up and running on port ${PORT}`);
}
bootstrap();
