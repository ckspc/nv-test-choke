import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: UserDto): Promise<User> {
    const { name, email, password } = userDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { email: user.email };
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: any): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: payload.email } });
  }

  async getUserIdFromToken(token: string): Promise<number> {
    try {
      const decodedToken = this.jwtService.verify(token);
      if (decodedToken && decodedToken.email) {
        const user = await this.userRepository.findOne({
          where: { email: decodedToken.email },
        });
        if (user) {
          return user.id;
        }
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    return null;
  }
}
