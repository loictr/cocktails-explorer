from dependency_injector import containers, providers
import chromadb
from chromadb.config import Settings
import os

from suggest_service import SuggestService
from repository import Repository

if not os.path.exists("config.yml"):
    raise FileNotFoundError("The configuration file 'config.yml' does not exist.")

class Container(containers.DeclarativeContainer):

    config = providers.Configuration(yaml_files=["./config.yml"], strict=True)
    config.load()
    
    # Override config with env var if present
    chromadb_path = os.getenv('CHROMADB_PATH', config.chromadb.persist_directory())

    db_client = providers.Factory(
        chromadb.PersistentClient,
        path=chromadb_path,
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