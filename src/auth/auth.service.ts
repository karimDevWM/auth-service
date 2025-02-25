import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/typeorm/entities/Role';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignInUserDto } from './dtos/signinUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async createUser({ email, username, password }: CreateUserDto) {
    const domain = email.split('@')[1];
    console.log('the domain is :', domain);
    const isAdmin = domain === process.env.PROJECT_NAME;
    const roleName = isAdmin ? 'admin' : 'member';
    const role = await this.roleRepository.findOne({
      where: { roleName: roleName },
    });

    if (!role) {
      throw new Error(`Role "${roleName}" not found in the database`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email: email,
      username: username,
      password: hashedPassword,
      userRole: role,
    });
    await this.userRepository.save(user);
    return { message: 'user registered' };
  }

  async login({ email, password }: SignInUserDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['userRole'],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('invalid credentials');
    }
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.userRole.roleName,
    });

    return { token };
  }

  async validateToken(data: { token: string }) {
    try {
      const decoded = this.jwtService.verify(data.token);
      const isRegisteredUser = await this.userRepository.findOne({
        where: { id: decoded.id },
      });
      if (isRegisteredUser) {
        console.log(`token validated: username = ${isRegisteredUser.username}`);
        return { userId: decoded.id, role: decoded.role };
      }
    } catch (error) {
      console.log('invalid token : ', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
