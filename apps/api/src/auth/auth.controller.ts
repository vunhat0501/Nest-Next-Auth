import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth/local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import type { AuthRequest } from 'src/auth/types/auth-request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user.id, req.user.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getAll(@Request() req: AuthRequest) {
    return {
      message: `Now you can access protected route. Your user ID: ${req.user.id}`,
    };
  }

  @Post('refresh')
  refreshToken(@Request() req: AuthRequest) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }
}
