import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtAuthenticationGuard from './jwtAuthentication.guard';
import User from '../users/user.entity';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  register(@Body() registrationData: RegisterDto): Promise<User> {
    return this.authenticationService.register(registrationData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser): Promise<User> {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  logOut(@Req() request: RequestWithUser) {
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return request.res.sendStatus(200);
  }
}
