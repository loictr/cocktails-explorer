# scripts/upload_initial_db.py
import os
from azure.storage.fileshare import ShareServiceClient
from azure.core.exceptions import ResourceExistsError

def upload_chromadb():
    connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
    service_client = ShareServiceClient.from_connection_string(conn_str=connection_string)
    
    # Ensure the file share exists
    file_share_name = "chromadb"
    file_share_client = service_client.get_share_client(file_share_name)
    try:
        file_share_client.create_share()
        print(f"File share '{file_share_name}' created.")
    except ResourceExistsError:
        print(f"File share '{file_share_name}' already exists.")

    # Upload local db directory to Azure Files
    local_db_path = '../db'
    
    for root, dirs, files in os.walk(local_db_path):
        for file in files:
            print(f'Uploading {file}...')
            
            local_file_path = os.path.join(root, file)
            azure_file_path = os.path.relpath(local_file_path, local_db_path)
            
            # Create directory in Azure if needed
            directory_path = os.path.dirname(azure_file_path)
            if directory_path and directory_path != '.':
                dir_client = file_share_client.get_directory_client(directory_path)
                try:
                    dir_client.create_directory()
                    print(f"Directory '{directory_path}' created.")
                except ResourceExistsError:
                    print(f"Directory '{directory_path}' already exists.")
            
            # Upload file
            file_client = file_share_client.get_file_client(azure_file_path)
            with open(local_file_path, 'rb') as source_file:
                file_client.upload_file(source_file)
                print(f"File '{azure_file_path}' uploaded.")

if __name__ == "__main__":
    upload_chromadb()