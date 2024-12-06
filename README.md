All data comes from www.thecocktaildb.com .

# Data initialization

steps:
1. `aggregator.ipnyb`: crawl the api to store all the recipes, and store them in `data` folder
2. `processing/processing_ingredients.py`: extract all ingredients, build their characteristics, and store them in `data/ingredients` folder
3. `processing/vectorize_recipes_with_ingredients_charac.py`: based on recipes files and ingredients files, build the vector database

For now, the db is created locally and deployed as-is


# Deployment

see [the specific readme](deployment\readme.md)