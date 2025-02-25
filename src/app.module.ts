import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { Role } from './typeorm/entities/Role';
import { Task } from './typeorm/entities/Task';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_db',
      username: 'testuser',
      password: 'testuser123',
      port: 3306,
      database: 'nestjsnatsauth_db',
      entities: [User, Role, Task],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
