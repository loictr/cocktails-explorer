DATA_DIRECTORY = '../data'
DB_DIRECTORY = '../db'

from importlib.metadata import files
import os
from typing import Any, Dict, Iterator, Literal
import pandas as pd
import json
import pprint
import inflect
import pprint as pprint
from sklearn.feature_extraction import DictVectorizer
from unidecode import unidecode

from ingredient_model import IngredientCharacteristicsResult

# load recipes

df=None
for result_set in range(0, 26):
    file_path =f'{DATA_DIRECTORY}/cocktails_{result_set}.json' 
    with open(file_path, 'r') as f:
        data = json.load(f)
        if(data['drinks'] is None or len(data['drinks']) == 0):
            continue
        df1 = pd.json_normalize(data['drinks'])
        df1.index = df1['idDrink']
        if df is None:
            df = df1
        else:
            df = pd.concat([df, df1])

print("df.size=",df.size)



# load ingredients


def normalize_ingredient_name(name: str) -> str:
    name = name.strip().upper()
    if name.endswith('S'):
        name = name[:-1]
    name = unidecode(name)
    name = ''.join(char for char in name if char.isalnum() or char.isspace())
    name = name.replace('.', '')
    return name



ingredients: Dict[str, Any] = {}
files = os.listdir(f'{DATA_DIRECTORY}/ingredients')

for file in files:
    if(file.startswith("_error_")):
        continue

    with open(f'{DATA_DIRECTORY}/ingredients/{file}', 'r') as f:
        data = IngredientCharacteristicsResult(**json.load(f))
        normalized_name = normalize_ingredient_name(data.name)

        # if name != data.name:
        #     print(f"normalized {data.name} to {name}")
        if normalized_name != normalize_ingredient_name(file.replace('.json', '')):
            print(f"File do not match name {file} -> {name}")
            
        ingredients[normalized_name] = data

print(f"loaded {len(ingredients)} ingredients")

p = inflect.engine()





def build_ingredients(row):
    ingredients = {}
    for i in range(1, 16):
        ingredient = row[f'strIngredient{i}']
        if ingredient is None or ingredient == '':
            break
        name = normalize_ingredient_name(ingredient)
        measure = row[f'strMeasure{i}']
        ingredients[name] = measure
    return ingredients

def build_ingredients_characteristics(row):
    current_recipe_ingredient_characteristics = {}
    for ingredient in row['ingredients'].keys():
        ingredient_normalized = normalize_ingredient_name(ingredient)
        if ingredient_normalized not in ingredients.keys():
            print(f"ingredient {ingredient} not found in ingredients")
            continue
        current_recipe_ingredient_characteristics[ingredient_normalized] = ingredients[ingredient_normalized]
    return current_recipe_ingredient_characteristics

def build_features(row):
    features = {}
    for ingredient, characteristics in row['ingredients_characteristics'].items():
        if characteristics.result.type == 'error':
            continue

        if characteristics.result.alcoholic is not None:
            if features.get('alcoholic') is None or features['alcoholic'] == False:
                features['alcoholic'] = characteristics.result.alcoholic
        
        if characteristics.result.alcohol_type is not None:
            if features.get('alcohol_type') is None:
                features['alcohol_type'] = characteristics.result.alcohol_type.value
        
        # should be converted to a note (most clear to most opaque)
        # if characteristics.result.clarity is not None:
        #     features['clarity'] = characteristics.result.clarity

        # should be converted to a note (most liquid to most dense)
        # if characteristics.result.texture is not None:
        #     features['texture'] = characteristics.result.texture

        if characteristics.result.texture == 'sparkling':
            if features.get('sparkling') is None:
                features['sparkling'] = True

        #if characteristics.result.origin_type is not None:
        #    features['origin_type'] = characteristics.result.origin_type
        #if characteristics.result.season is not None:
        #    features['season'] = characteristics.result.season

        for flavor_name, flavor_value in characteristics.result.flavors.dict().items():
            if flavor_value is not None:
                if features.get(flavor_name) is None or features[flavor_name] < flavor_value:
                    features[flavor_name] = flavor_value

    return features


df['ingredients'] = df.apply(build_ingredients, axis=1)
print("df.size=",df.size)
df['ingredients_characteristics'] = df.apply(build_ingredients_characteristics, axis=1)
print("df.size=",df.size)
df['features'] = df.apply(build_features, axis=1)
print("df.size=",df.size)




vectorizer = DictVectorizer(sparse=False)
vectorizer.fit(df['features'])
df['embeddings'] = df['features'].apply(lambda x: vectorizer.transform(x))

print("\nFeatures for drink with ID 17225:")
pprint.pp(df.loc['17225', 'features'])

# persist vectors

import chromadb
from chromadb.config import Settings
import os

# Initialize Chroma client (in-memory for quick POC)
db = chromadb.PersistentClient(
        path=DB_DIRECTORY,
        settings=Settings(allow_reset=True)
    )



# class MyCustomEmbeddingFunction(chromadb.EmbeddingFunction):
#     def __init__(
#             self
#     ):
#         """Initialize the embedding function."""

#     def __call__(self, input) -> chromadb.Embeddings:
#         features = json.loads(input[0]) # how to avoid serializing / deserializing ?
#         pprint.pp(features)
#         e = vectorizer.transform(features)
#         pprint.pp(e)
#         pprint.pp(vectorizer.inverse_transform(e))
#         return e





# Create a collection for cocktails
collection_name = "cocktails_with_ingredients_characteristics"
if(collection_name in [collection.name for collection in db.list_collections()]):
    print("Deleting existing collection")
    db.delete_collection(collection_name)

collection = db.create_collection(collection_name)

for id, row in df.iterrows():
    # print(f"-------- {row['strDrink']}")
    # pprint.pp(row['embeddings'][0])
    # pprint.pp(vectorizer.inverse_transform(row['embeddings']))
    collection.add(
        embeddings=[row['embeddings'][0]],
        documents=[row["strDrink"]],#[json.dumps(row['features'])],
        metadatas={
            "name": row["strDrink"], 
            "id": row["idDrink"], 
            "ingredients": json.dumps(row["ingredients"]),
            "image_thumb": row["strDrinkThumb"],
            "alcohol": row["strAlcoholic"],
            "glass": row["strGlass"],
            "instructions": row["strInstructions"],
            },
        ids=[row["idDrink"]]
    )

print("Collection created")