
import json
import pprint
import chromadb
from chromadb.config import Settings
import os
import numpy as np

DATA_DIRECTORY = '../data'
DB_DIRECTORY = '../db'

collection_name = "cocktails_with_ingredients_characteristics"

db = chromadb.PersistentClient(
        path=DB_DIRECTORY,
        settings=Settings(allow_reset=True)
    )



liked_recipes_names = ['French Connection', 'Foxy Lady']

# get the vectors for the liked recipes

db_collection = db.get_collection(collection_name)

liked_recipes = db_collection.get(where={"name": {"$in": liked_recipes_names}})
liked_recipes_ids = [cocktail["id"] for cocktail in liked_recipes["metadatas"]]

print("----- liked recipes:")
pprint.pp(liked_recipes)

print('\n')
print(f"Querying {db_collection.count()} cocktails...")

liked_recipes_vectors = db_collection.get(ids=liked_recipes_ids, include=["metadatas", "embeddings"])
combined_embedding = np.max(liked_recipes_vectors["embeddings"], axis=0).tolist()

where_clause = {"id": {"$nin": liked_recipes_ids}}

# can use liked_recipes_vectors or combined_embedding (or both?)
results = db_collection.query(combined_embedding, where=where_clause, n_results=5, include=["metadatas", "distances","documents"])

results_structured = []
for result_set, metadatas in enumerate(results["metadatas"]):
    for index_in_result_set, metadatas_for_result_set in enumerate(metadatas): 
        results_structured.append(
            {
                'id': metadatas_for_result_set["id"],
                'name': metadatas_for_result_set["name"],
                'distance': results["distances"][result_set][index_in_result_set],
                'ingredients': json.loads(metadatas_for_result_set["ingredients"]),
                'result_set_index': result_set
            })

results_structured = sorted(results_structured, key=lambda x: x['distance'])

# Remove duplicates by keeping the first occurrence of each id
seen_ids = set()
results_structured = [x for x in results_structured if x['id'] not in seen_ids and not seen_ids.add(x['id'])]


print('------------- suggested recipes:')
pprint.pp(results_structured)