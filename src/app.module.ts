import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { Users } from './entities/users.entity';
import { UsersModule } from './users/users.module';
import { Message } from './entities/message.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'game',
      entities: [Users, Message],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public'),
    }),
    AuthModule,
    UsersModule,
    ChatModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
