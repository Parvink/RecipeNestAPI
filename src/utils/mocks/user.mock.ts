import User from '../../users/user.entity';

export const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  name: 'John',
  password: 'hash',
  savedRecipes: [],
  createTime: new Date(),
  updateTime: new Date(),
};
