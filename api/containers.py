from dependency_injector import containers, providers
import chromadb
from chromadb.config import Settings

from suggest_service import SuggestService
from repository import Repository
import os

if not os.path.exists("config.yml"):
    raise FileNotFoundError("The configuration file 'config.yml' does not exist.")

config = providers.Configuration(yaml_files=["config.yml"])
print(config.chromadb())

class Container(containers.DeclarativeContainer):

    config = providers.Configuration(yaml_files=["./config.yml"], strict=True)
    config.load()

    db_client = providers.Factory(
        chromadb.PersistentClient,
        path=config.chromadb.persist_directory(),
        settings=Settings(allow_reset=True, anonymized_telemetry=False),
    )

    repository = providers.Factory(
        Repository,
        db_client=db_client,
    )

    suggest_service = providers.Factory(
        SuggestService,
        db_client=db_client,
    )