import { HttpException, HttpStatus } from '@nestjs/common';

class WrongCredentialsException extends HttpException {
  constructor() {
    super('The credentials provided were not valid', HttpStatus.UNAUTHORIZED);
  }
}

export default WrongCredentialsException;
