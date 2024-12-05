DATA_DIRECTORY = '../data'
DB_DIRECTORY = '../db'

# load recipes

import os
from time import sleep
from typing import Any, Dict, Literal
import pandas as pd
import json
import pprint
import inflect
import pprint as pprint

from unidecode import unidecode

from ingredient_model import IngredientCharacteristicsResult

df=None
for result_set in range(0, 26):
    file_path =f'{DATA_DIRECTORY}/cocktails_{result_set}.json' 
    with open(file_path, 'r') as f:
        data = json.load(f)
        if(data['drinks'] is None or len(data['drinks']) == 0):
            continue
        df1 = pd.json_normalize(data['drinks'])
        if df is None:
            df = df1
        else:
            df = pd.concat([df, df1])

print("df.size=",df.size)

p = inflect.engine()

do_not_singluarize = [
    'Anis',
]

def build_ingredients(row):
    ingredients = {}
    for i in range(1, 16):
        ingredient = row[f'strIngredient{i}']
        if ingredient is None or ingredient == '':
            break
        if ingredient not in do_not_singluarize:
            ingredient = p.singular_noun(ingredient) or ingredient
        name = ingredient.strip().title()
        measure = row[f'strMeasure{i}']
        ingredients[name] = measure
    return ingredients


df['ingredients'] = df.apply(build_ingredients, axis=1)

recipes = []
for index, row in df.iterrows():
    recipe = {}
    recipe['id'] = row['idDrink']
    recipe['name'] = row['strDrink']
    recipe['instructions'] = row['strInstructions']
    recipe['image_thumb'] = row['strDrinkThumb']
    recipe['alcohol'] = row['strAlcoholic']
    # recipe['is_alcoolic'] = row['strDrinkThumb'] # possible values: 'Alcoholic' 'Non alcoholic' 'Optional alcohol'
    recipe['ingredients'] = row['ingredients']
    recipe['glass'] = row['strGlass']
    recipes.append(recipe)


# get the ingredients list

unique_ingredients = set()
for recipe in recipes:
    unique_ingredients=unique_ingredients.union(recipe['ingredients'].keys())

#pprint.pprint(sorted(unique_ingredients))



# get the ingredients characteristics


from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.output_parsers import PydanticOutputParser
from concurrent.futures import ThreadPoolExecutor
import json
import pprint
from enum import Enum


parser = PydanticOutputParser(pydantic_object=IngredientCharacteristicsResult)

# format_instructions = parser.get_format_instructions()
# # double escape the curly braces: one time for the python formatted string, one time for the ollama prompt template
# format_instructions = format_instructions.replace("'appearance': {'anyOf': [{'$ref': '#/$defs/IngredientAppearance'},", "'appearance': {'strict':true, 'anyOf': [{'$ref': '#/$defs/IngredientAppearance'},")
# format_instructions = format_instructions.replace("{", "{{{{").replace("}", "}}}}")

#schema = IngredientCharacteristicsResult.model_json_schema()
#pprint.pprint(format_instructions)

# with open(f'./ingredient_characteristic.schema.json', 'r') as f:
#     schema = json.load(f)




ingredient_characteristics_system_prompt = f"""you are an expert in mixology and nutritionism, the user will give you one ingredient, you will produce a report with its characteristics.

Your response MUST match this exact structure:
{{{{
    "name": "<ingredient_name>",
    "result": {{{{
        "type": "characteristics",

        'flavors': {{{{
            "sweet": <presence of this flavor in the ingredient>,
            "sour": <presence of this flavor in the ingredient>,
            "bitter": <presence of this flavor in the ingredient>, 
            "salty": <presence of this flavor in the ingredient>,
            "umami": <presence of this flavor in the ingredient>,

            "citrusy": <presence of this flavor in the ingredient>,
            "tart": <presence of this flavor in the ingredient>,
            "fruity": <presence of this flavor in the ingredient>,
            "herbal": <presence of this flavor in the ingredient>,
            "spicy": <presence of this flavor in the ingredient>,
            "floral": <presence of this flavor in the ingredient>,
            "woody": <presence of this flavor in the ingredient>,
            "smoky": <presence of this flavor in the ingredient>,
        }}}},

        "flavors_other": [ <other flavors in the ingredient> ],
        "origin_type": <origin of the ingredient, or null if unknown>,  # ONLY use: fruit, herb, spice, dairy, sweetener, mixer, garnish
        "alcoholic": <whether the ingredient is alcoholic>,
        "alcohol_type": <type of alcohol>,  # ONLY use: spirits, wine, beer, liqueur, vodka, gin, rum, whiskey, tequila
        "clarity": <appearance of the ingredient>,  # ONLY use: clear, cloudy, hazy, opaque
        "texture": <texture of the ingredient>,  # ONLY use: smooth, creamy, syrupy, liquid, jelly, sparkling
        "season": <primary season associated with the ingredient>,  # ONLY use: spring, summer, autumn, winter, all
    }}}},
    confidence: <confidence in the response> # required
}}}}

IMPORTANT:
- 'confidence' is a float between 0 and 1 that indicates the model's confidence in the response.
- flavors contains properties that accept a float value between 0 and 1. 0= the ingredients doesn't have this flavor, 1=the flavor is very present in this ingredient. Use null only for unknown.

When providing the characteristics of an ingredient, if any attribute like texture is unknown or not applicable, please set its value to null.

For errors:
{{{{
    "name": "<ingredient_name>",
    "result": {{{{
        "type": "error",
        "error": "<error_message>"
    }}}}
}}}}


example for the ingredient 'ice':
```
{{{{
     "name": "ice",
     "result": {{{{
         "type": "characteristics",
         "flavors": {{{{
             "sweet": null,
             "sour": null,
             "bitter": null,
             "salty": null,
             "umami": null,
             "citrusy": null,
             "tart": null,
             "fruity": null,
             "herbal": null,
             "spicy": null,
             "floral": null,
             "woody": null,
             "smoky": null
         }}}},
         "flavors_other": [],
         "origin_type": null,
         "alcoholic": false,
         "alcohol_type": null,
         "clarity": null,
         "texture": null,
         "season": "all"
     }}}},
     "confidence": 1.0
 }}}}
```

 example for 'milk':
 ```
 {{{{
    "confidence": 0.95,
    "name": "Milk",
    "result": {{{{
        "alcohol_type": null,
        "alcoholic": false,
        "clarity": "cloudy",
        "flavors": {{{{
            "bitter": 0.05,
            "citrusy": 0.0,
            "floral": 0.0,
            "fruity": 0.0,
            "herbal": 0.0,
            "salty": 0.01,
            "smoky": 0.0,
            "sour": 0.1,
            "spicy": 0.0,
            "sweet": 0.6,
            "tart": 0.0,
            "umami": 0.2,
            "woody": 0.0
        }}}},
        "flavors_other": [],
        "origin_type": "dairy",
        "season": null,
        "sparkling": false,
        "texture": "creamy",
        "type": "characteristics"
    }}}}
}}}}
```


Return ONLY the JSON object that matches the schema with its exact fields. Keep values simple and concise. Do not add any extra comment. Do not add extra fields."""


#print(ingredient_characteristics_system_prompt)



prompt = ChatPromptTemplate.from_messages(
    [
        ("system", ingredient_characteristics_system_prompt),
        ("human", "{ingredient}"),
    ]
)




llm = ChatOllama(model="gemma2:9b", format="json", temperature=0)


# ingredient = "7-up"
# try:
#     runnable = prompt | llm | parser
#     result = runnable.invoke({"ingredient": ingredient})
#     print('--- final result ---')
#     pprint.pprint(result.to_json())
# except Exception as e:
#     pprint.pprint(e)
#     print(f"Error: {e}")




# Process all ingredients


def to_file_name(ingredient:str) -> str:
    try:
        name = ingredient.strip().title()
        if name.endswith('S'):
            name = name[:-1]
        name = unidecode(name)
        name = ''.join(char for char in name if char.isalnum() or char.isspace())
        name = name.replace('.', '')
        return name+'.json'
    except Exception as e:

        print("----------- ERROR ------------")
        print(f"ingredient: {ingredient}")
        print(f"Failed to build file name from ingredient '{ingredient}': {e}")
        raise e
    

# some names are not understood by the model, so we need to translate them
forced_ingredient_name = [
    ('Port', 'Porto wine'),
    ('Ruby Port', 'Porto wine'),
    ('Peychaud Bitter', 'Peychaud\'s Bitters'),
]


retry_existing_errors = False


runnable = prompt | llm | parser
def process_ingredient(ingredient: str) -> Dict:
    filename = to_file_name(ingredient)
    filepath = f"{DATA_DIRECTORY}/ingredients/{filename}"
    filepath_error = f"{DATA_DIRECTORY}/ingredients/_error_{filename}"
    
    try:
        if(retry_existing_errors and os.path.exists(filepath_error)):
            os.remove(filepath_error)

        if(os.path.exists(filepath_error)):
            return None

        if(os.path.exists(filepath)):
            print(f"{ingredient}: already processed.")
            with open(filepath, "r") as f:
                result = parser.parse(f.read())
                return result
            
        
        print(f"{ingredient}: processing...")

        ingredient_name = ingredient
        ingredient_original = None
        for name, replacement in forced_ingredient_name:
            if ingredient == name:
                print(f"{ingredient}: using {replacement} instead")
                ingredient_name = replacement
                ingredient_original = ingredient
      

        result = runnable.invoke({"ingredient": ingredient_name})

        if ingredient_original:
            result.name = ingredient_original

        if to_file_name(result.name) != filename:
            print(f"Error: {ingredient} != {result.name}")
            with open(filepath_error, "w") as f:
                f.write(result.to_json())
            return result
        
        if(result.result.type == "error"):
            with open(filepath_error, "w") as f:
                f.write(result.to_json())
        else:
            with open(filepath, "w") as f:
                f.write(result.to_json())

        print(f"{ingredient}: processed!")
        return result
    except Exception as e:
        with open(filepath_error, "w") as f:
            f.write(json.dumps({"error": str(e)}))


print("Processing ingredients...")
print("Total count:", len(unique_ingredients))
processed_files = [f for f in os.listdir(f"{DATA_DIRECTORY}/ingredients") if f.endswith(".json") and not f.startswith("_error_")]
ingredients_to_process = [ingredient for ingredient in unique_ingredients if to_file_name(ingredient) not in processed_files]
print("Already processed:", len(processed_files))
print("Remaining:", len(ingredients_to_process))


ingredients_characteristics = None
with ThreadPoolExecutor(max_workers=2) as executor:
    ingredients_characteristics = list(executor.map(process_ingredient, ingredients_to_process))
