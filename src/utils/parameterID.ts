import { IsNumberString } from 'class-validator';

export default class ParameterID {
  @IsNumberString()
  id: string;
}
