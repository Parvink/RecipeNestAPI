import Recipe from '../../recipes/recipes.entity';

export const mockedRecipe: Recipe = {
  id: 1,
  title: 'Mock recipe',
  urlEdamam: 'http://www.edamam.com/fake/',
  urlWeb: 'http://www.weburl.com',
  imageLink: 'http://www.image.com',
  ecoClass: 'B',
  cuisineType: 'french',
  dishType: 'starter',
  ingredients: ['salt', 'pepper'],
  calories: 491,
  carbon: 444,
  createTime: new Date(),
  updateTime: new Date(),
};
