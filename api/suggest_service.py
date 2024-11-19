import json


class SuggestService:

    def __init__(self, db_client):
        self.db_client = db_client
        self.collection = db_client.get_collection("cocktails")

    def suggest(self, liked_ids:list[str], n_results:int):

        liked_recipes_vectors = self.collection.get(ids=liked_ids, include=["metadatas", "embeddings"])

        where_clause = {"id": {"$nin": liked_ids}}

        results = self.collection.query(liked_recipes_vectors["embeddings"], where=where_clause, n_results=n_results, include=["metadatas", "distances","documents"])

        results_structured = []
        for result_set, metadatas in enumerate(results["metadatas"]):
            for index_in_result_set, metadatas_for_result_set in enumerate(metadatas): 
                results_structured.append(
                    {
                        'id': metadatas_for_result_set["id"],
                        'name': metadatas_for_result_set["name"],
                        'image_thumb': metadatas_for_result_set["image_thumb"],
                        'glass': metadatas_for_result_set["glass"],
                        'alcohol': metadatas_for_result_set["alcohol"],
                        'ingredients': list(json.loads(metadatas_for_result_set["ingredients"]).keys()),
                        'distance': results["distances"][result_set][index_in_result_set],
                    })


        results_structured = sorted(results_structured, key=lambda x: x['distance'])

        return results_structured
        