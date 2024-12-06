# scripts/upload_initial_db.py
import os
import shutil
from azure.storage.file import FileService

def upload_chromadb():
    connection_string = os.environ['AZURE_STORAGE_CONNECTION_STRING']
    file_service = FileService(connection_string=connection_string)
    
    # Upload local db directory to Azure Files
    local_db_path = '../db'
    share_name = 'chromadb'
    
    for root, dirs, files in os.walk(local_db_path):
        for file in files:
            local_file_path = os.path.join(root, file)
            azure_file_path = os.path.relpath(local_file_path, local_db_path)
            
            # Create directory in Azure if needed
            directory_path = os.path.dirname(azure_file_path)
            if directory_path:
                file_service.create_directory(
                    share_name,
                    directory_path,
                    fail_on_exist=False
                )
            
            # Upload file
            with open(local_file_path, 'rb') as file_handle:
                file_service.create_file_from_stream(
                    share_name,
                    directory_path,
                    os.path.basename(azure_file_path),
                    file_handle,
                    len(file_handle.read())
                )

if __name__ == '__main__':
    upload_chromadb()