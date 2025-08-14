import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import refreshConfig from 'src/auth/config/refresh.config';
import { AuthJwtPayload } from 'src/auth/types/auth-jwtPayload';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}
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
    return { id: user.id, name: user.name, role: user.role };
  }

  async login(userId: number, name: string) {
    //** Get tokens from generateToken func */
    const { accessToken, refreshToken } = await this.generateToken(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }

  async generateToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };

    //** Generate both refresh and access token at the same time when login */
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  //** Check if user's JWT exist in database */
  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const currentUser = { id: user.id, role: user.id };
    return currentUser;
  }

  //** Check if user's refresh token exist in database */
  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.hashedRefreshToken)
      throw new UnauthorizedException('Refresh token not found');
    console.log('Refresh token from frontend', refreshToken);

    const refreshTokenMatched = await verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    console.log('Refresh token matched', refreshTokenMatched);

    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid refresh token');

    const currentUser = { id: user.id };
    return currentUser;
  }

  //TODO: tach thu hoi refresh token va tao moi access token thanh function khac nhau
  //** This function is for revoking user's refresh token */
  async refreshToken(userId: number, name: string) {
    const { accessToken, refreshToken } = await this.generateToken(userId);
    console.log('new refresh token before hashing', refreshToken);
    const hashedRefreshToken = await hash(refreshToken);
    console.log('new refresh token after hashing', hashedRefreshToken);
    await this.userService.updateHashRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser);
  }

  async signOut(userId: number) {
    return await this.userService.updateHashRefreshToken(userId, null);
  }
}
