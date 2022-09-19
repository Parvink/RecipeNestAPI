import User from '../users/user.entity';

export class PaginationOutput {
  users: User[];
  count: number;
}
