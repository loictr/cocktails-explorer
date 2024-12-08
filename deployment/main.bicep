// main.bicep
param location string = resourceGroup().location
param appName string

// Container Registry
resource acr 'Microsoft.ContainerRegistry/registries@2021-06-01-preview' existing = {
  name: '${appName}acr'
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' existing = {
  name: '${appName}-plan'
}

// Combined Web App
resource combinedApp 'Microsoft.Web/sites@2021-02-01' = {
  name: '${appName}'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${acr.properties.loginServer}/${appName}-combined:latest'
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: acr.properties.loginServer
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: acr.listCredentials().username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: acr.listCredentials().passwords[0].value
        }
        {
          name: 'CHROMADB_PATH'
          value: '/chromadb'
        }
        {
          name: 'AZURE_STORAGE_CONNECTION_STRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
      ]
    }
  }
}

// Add Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' existing = {
  name: '${appName}storage'
}

// Add File Share
resource fileService 'Microsoft.Storage/storageAccounts/fileServices@2021-06-01' existing = {
  name: 'default'
  parent: storageAccount
}

resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2021-06-01' existing = {
  name: 'chromadb'
  parent: fileService
}
