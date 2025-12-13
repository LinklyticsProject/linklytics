import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './database/prisma.service';
import { PrismaModule } from './database/prisma.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AuthModule);

  const configuration = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('Auth endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const prismaService = app.select(PrismaModule).get(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(configuration.get('PORT') ?? 3001);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
