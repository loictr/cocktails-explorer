// main.bicep
param location string = resourceGroup().location
param appName string

// Container Registry
resource acr 'Microsoft.ContainerRegistry/registries@2021-06-01-preview' = {
  name: '${appName}acr'
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: '${appName}-plan'
  location: location
  sku: {
    name: 'P1v2'
    tier: 'PremiumV2'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Combined Web App
resource combinedApp 'Microsoft.Web/sites@2021-02-01' = {
  name: '${appName}'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|nginx:alpine'
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${acr.properties.loginServer}'
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
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value}'
        }
      ]
      azureStorageAccounts: {
        chromadb: {
          type: 'AzureFiles'
          accountName: storageAccount.name
          shareName: 'chromadb'
          mountPath: '/chromadb'
          accessKey: listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value
        }
      }
    }
  }
}

// Add Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: '${appName}storage'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

// Add File Share
resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2021-06-01' = {
  name: '${storageAccount.name}/default/chromadb'
}
