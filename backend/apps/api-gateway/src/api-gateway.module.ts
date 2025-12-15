import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthProxyMiddleware } from './middleware/auth-proxy.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthProxyMiddleware).forRoutes({ path: '/auth/*', method: RequestMethod.ALL });
  }
}