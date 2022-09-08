export function constructUrl(appId: string, appKey: string): string {
  const fields: string[] = [
    'label',
    'url',
    'uri',
    'calories',
    'image',
    'ingredientLines',
    'totalCO2Emissions',
    'co2EmissionsClass',
    'cuisineType',
    'dishType',
  ];
  let url = `https://api.edamam.com/api/recipes/v2?app_id=${appId}&app_key=${appKey}&q=&type=public&random=true&health=vegetarian&beta=true&ingr=5-10`;

  for (const field of fields) {
    url += `&field=${field}`;
  }
  return url;
}
