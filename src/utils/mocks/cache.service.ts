const emptyArr: string[] = [];

export const mockedCacheService = {
  get: () => 'any value',
  set: () => jest.fn(),
  store: {
    keys: jest.fn().mockReturnValue(emptyArr),
  },
};
