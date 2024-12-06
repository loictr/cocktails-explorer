# Gihub deployment
Add the following secrets to GitHub:

AZURE_CREDENTIALS
ACR_LOGIN_SERVER
ACR_USERNAME
ACR_PASSWORD

# Azure CLI commands for setup
```shell
# Create resource group
az group create --name cocktails-rg --location westeurope

# Deploy infrastructure
az deployment group create \
  --resource-group cocktails-rg \
  --template-file deployment/main.bicep \
  --parameters appName=cocktails

# Create service principal for GitHub Actions
az ad sp create-for-rbac --name "cocktails-github" \
    --role contributor \
    --scopes /subscriptions/{subscription-id}/resourceGroups/cocktails-rg
```


# docker compose

```shell
docker-compose -f deployment/docker-compose.yml up --build
```

Access the services:

API: http://localhost:4201
Frontend: http://localhost:80


```shell
docker-compose down
```
