import User from '../users/user.entity';

export class PaginationUsersOutput {
  users: User[];
  count: number;
}
