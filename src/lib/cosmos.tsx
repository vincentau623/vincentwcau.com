import { Container, CosmosClient, Database } from "@azure/cosmos";

class CosmosSingleton {
  database: Database | null;
  container: Container | null;
  constructor() {
    this.database = null;
    this.container = null;
  }

  async initialize() {
    if (!this.database || !this.container) {
      if (process.env.COSMOSDB_DATABASE_NAME === undefined || process.env.COSMOSDB_CONTAINER_NAME === undefined || process.env.COSMOSDB_CONNECTION_STRING === undefined) {
        throw new Error("COSMOSDB_DATABASE_NAME, COSMOSDB_CONTAINER_NAME, and COSMOSDB_CONNECTION_STRING must be set in the environment variables");
      }
      const databaseName = process.env.COSMOSDB_DATABASE_NAME;
      const containerName = process.env.COSMOSDB_CONTAINER_NAME;
      const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
      const database = client.database(databaseName);
      const container = database.container(containerName);
      await client.databases.createIfNotExists({
        id: databaseName,
      });
      await database.containers.createIfNotExists({
        id: containerName,
        partitionKey: "/id"
      });
      this.database = database;
      this.container = container;
    }
  }

  getDatabase() {
    return this.database;
  }

  getContainer() {
    return this.container;
  }
}

const cosmosSingleton = new CosmosSingleton();
export default cosmosSingleton;

// Reference: https://github.com/Azure/azurecosmosdb-vercel-starter