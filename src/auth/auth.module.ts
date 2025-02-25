import { Module, OnModuleInit } from '@nestjs/common';
import { AuthMicroservicesController } from './auth.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Role } from 'src/typeorm/entities/Role';
import { AuthService } from './auth.service';
import { RoleSeeder } from './role.seeder';
import { Task } from 'src/typeorm/entities/Task';

@Module({
  imports: [
    NatsClientModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User, Role, Task]),
  ],
  controllers: [AuthMicroservicesController],
  providers: [AuthService, JwtStrategy, RoleSeeder],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly roleSeeder: RoleSeeder) {}
  async onModuleInit() {
    await this.roleSeeder.seedRoles();
  }
}
