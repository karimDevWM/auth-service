import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/createUser.dto';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dtos/signinUser.dto';

@Controller()
export class AuthMicroservicesController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'createUser' })
  createUser(@Payload() data: CreateUserDto) {
    console.log('user data received for signup : ', data);
    return this.authService.createUser(data);
  }

  @MessagePattern({ cmd: 'loginUser' })
  loginUser(@Payload() data: SignInUserDto) {
    console.log('user data received for signin');
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'validateToken' })
  validateToken(@Payload() data: { token: string }) {
    console.log('token received from api gateway for validation', data);
    return this.authService.validateToken(data);
  }
}
