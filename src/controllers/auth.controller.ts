import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserDto, UserLoginDto } from '../dtos/user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: UserDto): Promise<UserDto> {
    return this.authService.register(userDto);
  }

  @Post('login')
  async login(@Body() loginDto: UserLoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const token = await this.authService.login(email, password);
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
