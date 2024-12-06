# Docker compose for local deployment testing

```shell
docker-compose -f deployment/docker-compose.yml up --build
```

Access the services:

API: http://localhost:4201
Frontend: http://localhost:4200


```shell
docker-compose down
```

# Azure CLI commands for setup
```shell
# Login
az login --scope https://management.core.windows.net//.default

# Create resource group
az group create --name cocktails-rg --location westeurope

# Deploy infrastructure
az deployment group create --resource-group cocktails-rg --template-file deployment/main.bicep --parameters appName=cocktails

# Create service principal for GitHub Actions (AZURE_CREDENTIALS)
az ad sp create-for-rbac --name "cocktails-github" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/cocktails-rg

# Get the ACR informations
# ACR_LOGIN_SERVER:
az acr show --name cocktailsacr --query "loginServer" --output tsv
# ACR_USERNAME and ACR_PASSWORD
az acr credential show --name cocktailsacr
```

# Github deployment
Add the following secrets to GitHub:

- AZURE_CREDENTIALS
- ACR_LOGIN_SERVER
- ACR_USERNAME
- ACR_PASSWORD


