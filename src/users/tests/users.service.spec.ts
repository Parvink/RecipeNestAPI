import { CACHE_MANAGER } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { rejects } from 'assert';
import { DeleteResult } from 'typeorm';
import CreateAuthenticationDto from '../../authentication/dto/register.dto';
import { mockedCacheService } from '../../utils/mocks/cache.service';
import CreateUserDto from '../dto/create-user.dto';
import UpdateUserDto from '../dto/update-user.dto';
import UserNotFoundException from '../exceptions/userNotFound.exception';
import User from '../user.entity';
import { UsersService } from '../users.service';

describe('The UsersService', () => {
  let usersService: UsersService;
  let findOneBy: jest.Mock;
  let save: jest.Mock;
  let update: jest.Mock;
  let mockedDelete: DeleteResult;
  let findOne: jest.Mock;
  beforeEach(async () => {
    findOneBy = jest.fn();
    mockedDelete = new DeleteResult();
    mockedDelete.affected = 1;
    save = jest.fn();
    update = jest.fn(() => new User());
    findOne = jest.fn(() => new User());
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy,
            create: jest.fn(() => new User()),
            save,
            update,
            findOne,
            delete: jest.fn(() => mockedDelete),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockedCacheService,
        },
      ],
    }).compile();
    usersService = await module.get(UsersService);
  });
  describe('when getting a user by email', () => {
    describe('and the user is matched', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOneBy.mockReturnValue(Promise.resolve(user));
      });
      it('should return the user', async () => {
        const fetchedUser = await usersService.getByEmail('test@test.com');
        expect(fetchedUser).toEqual(user);
      });
    });
    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOneBy.mockReturnValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(
          usersService.getByEmail('test@test.com'),
        ).rejects.toThrow();
      });
    });
  });
  describe('when spying on the user CRUD', () => {
    it('should call create method with expected params', async () => {
      const createUserSpy = jest.spyOn(usersService, 'create');
      const dto = new CreateAuthenticationDto();
      await usersService.create(dto);
      expect(createUserSpy).toHaveBeenCalledWith(dto);
    });

    it('should call deleteUser method with expected param', async () => {
      const deleteUserSpy = jest.spyOn(usersService, 'deleteUser');
      const id = 2;
      await usersService.deleteUser(id);
      expect(deleteUserSpy).toHaveBeenCalledWith(id);
    });
    let user: User;
    beforeEach(() => {
      user = new User();
      findOneBy.mockReturnValue(Promise.resolve(user));
    });
    it('should call getUserById method with expected param and returns an user', async () => {
      const getUserByIdSpy = jest.spyOn(usersService, 'getUserById');
      const id = 10;
      const fetchedUser = await usersService.getUserById(id);
      expect(getUserByIdSpy).toHaveBeenCalledWith(id);
      expect(fetchedUser).toEqual(user);
    });

    it('should call updateUser method with expected params and returns the user', async () => {
      const updateUserSpy = jest.spyOn(usersService, 'updateUser');
      const id = 3;
      const dto = new UpdateUserDto();
      const updatedUser = await usersService.updateUser(id, dto);
      expect(updateUserSpy).toHaveBeenCalledWith(id, dto);
      expect(updatedUser).toEqual(user);
    });
    describe('checking that UserNotFound exceptions are thrown', () => {
      beforeEach(() => {
        findOneBy.mockReturnValue(Promise.resolve(undefined));
        findOne.mockReturnValue(Promise.resolve(undefined));
      });
      it('should call getUserById method and throw an UserNotFoundException', async () => {
        const id = 10;
        await expect(() => usersService.getUserById(id)).rejects.toThrow(
          new UserNotFoundException(id),
        );
      });
      it('should call updateUser method and throw an UserNotFoundException', async () => {
        const id = 3;
        const dto = new UpdateUserDto();
        await expect(() => usersService.updateUser(id, dto)).rejects.toThrow(
          new UserNotFoundException(id),
        );
      });
    });
  });
});
