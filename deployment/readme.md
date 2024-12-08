# Docker compose for local deployment testing

```shell
docker-compose -f [docker-compose.yml](http://_vscodecontentref_/2) up --build
```

Access the services:

API: http://localhost:5000/api/cocktails
Frontend: http://localhost


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

# Get the storage connection string
az storage account show-connection-string --name cocktailsstorage --resource-group cocktails-rg
```

# Github deployment
See `/.github/workflows/deploy.yml` for Github Actions workflow

Add the following secrets to GitHub:

- AZURE_CREDENTIALS

The value of the secret is a json:
```json
{
    "clientSecret":  "<password in the create-for-rbac result>",
    "subscriptionId":  "<subscription id>",
    "tenantId":  "<tenant in the create-for-rbac result>",
    "clientId":  "<appId in the create-for-rbac result>"
}
```

- ACR_LOGIN_SERVER
```shell
az acr show --name cocktailsexploreracr --query "loginServer" --output tsv
```

- ACR_USERNAME
- ACR_PASSWORD
```shell
az acr credential show --name cocktailsexploreracr
```

- AZURE_STORAGE_CONNECTION_STRING
```shell
az storage account show-connection-string --name cocktailsexplorerstorage --resource-group cocktails-rg
```
