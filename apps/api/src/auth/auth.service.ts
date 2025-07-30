import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);

    //** check if user already exists */
    if (user) throw new ConflictException('User already exists');
    return this.userService.create(createUserDto);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    //** check if user exist in db and password is correct */
    if (!user) throw new UnauthorizedException('User not found');
    const isPasswordMatched = await verify(user.password, password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid credentials');
    return { id: user.id, name: user.name };
  }
}
