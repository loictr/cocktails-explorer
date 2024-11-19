import json
import chromadb


class Repository:
    def __init__(self, db_client: chromadb.Client):
        self.client = db_client
        self.collection:chromadb.Collection = db_client.get_collection("cocktails")

    def get_cocktails(self):
        results = self.collection.get(include=["metadatas"])
        results_structured = []
        for metadatas in results["metadatas"]:
            results_structured.append(
                {
                    'id': metadatas["id"],
                    'name': metadatas["name"],
                    'image_thumb': metadatas["image_thumb"],
                    'glass': metadatas["glass"],
                    'alcohol': metadatas["alcohol"],
                    'ingredients': list(json.loads(metadatas["ingredients"]).keys()),
                })
        return sorted(results_structured, key=lambda x: x['name'])

    def get_cocktail_details(self, id):
        results = self.collection.get([id], include=["metadatas"])
        if(len(results) == 0):
            return None
        
        metadatas = results['metadatas'][0]
        results_structured= {
                    'id': metadatas["id"],
                    'name': metadatas["name"],
                    'image_thumb': metadatas["image_thumb"],
                    'glass': metadatas["glass"],
                    'alcohol': metadatas["alcohol"],
                    'measures': json.loads(metadatas["ingredients"]),
                    'instructions': metadatas["instructions"],
                }
        return results_structured

