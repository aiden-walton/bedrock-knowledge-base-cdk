# Bedrock Knowledge Base CDK construct

## Introduction

With Knowledge Bases for Amazon Bedrock, you can give FMs and agents contextual information from your company’s private data sources for Retrieval Augmented Generation (RAG) to deliver more relevant, accurate, and customized responses

Read the [Knowledge Bases for Amazon Bedrock documentation](https://aws.amazon.com/bedrock/knowledge-bases/) for further information.

## Construct Properties

| Property                              | Description                                                                                        |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `stage`                               | The CDK deployment stage (e.g. dev, staging, production).                                                        |
| `region`                              | The AWS region where the knowledge base is deployed.                                               |
| `removalPolicy`                       | Optional. Policy for the knowledge base removal (e.g., `RemovalPolicy.DESTROY`).                   |
| `knowledgeBaseName`                   | The name of the knowledge base.                                                                    |
| `knowledgeBaseDescription`            | Optional. A description for the knowledge base.                                                    |
| `knowledgeBaseRoleArn`                | The Amazon Resource Name (ARN) of the IAM role for the knowledge base.                             |
| `knowledgeBaseStorageConfiguration`   | Configuration for the storage of the knowledge base.                                               |
| ↳ `type`                              | Type of storage (e.g., "PINECONE", "OPENSEARCH_SERVERLESS").                                       |
| ↳ `opensearchServerlessConfiguration` | Optional. Configuration for OpenSearch Serverless storage.                                         |
| ↳ `pineconeConfiguration`             | Optional. Configuration for Pinecone storage.                                                      |
| ↳ `rdsConfiguration`                  | Optional. Configuration for RDS storage.                                                           |
| ↳ `redisEnterpriseCloudConfiguration` | Optional. Configuration for Redis Enterprise Cloud storage.                                        |
| `embeddingModel`                      | The embedding model used for the knowledge base (e.g., `AMAZON_TITAN_EMBEDDINGS_G1_TEXT_V1`).      |
| `knowledgeBaseDataSource`             | Configuration for the data source of the knowledge base.                                           |
| ↳ `dataSourceName`                    | The name of the data source.                                                                       |
| ↳ `dataSourceConfiguration`           | Configuration details of the data source.                                                          |
| ↳ `type`                              | The type of data source (e.g., "S3").                                                              |
| ↳ `s3Configuration`                   | Specific configuration for S3 data source, including `bucketArn` and optional `inclusionPrefixes`. |
| **OpenSearchServerlessConfiguration** |                                                                                                    |
| `collectionArn`                       | The ARN of the OpenSearch Serverless collection.                                                   |
| `vectorIndexName`                     | The name of the vector index in OpenSearch Serverless.                                             |
| `fieldMapping`                        | Field mapping for vector, text, and metadata fields in OpenSearch Serverless.                      |
| **PineconeConfiguration**             |                                                                                                    |
| `connectionString`                    | Connection string to Pinecone database.                                                            |
| `credentialsSecretArn`                | ARN of the secret containing credentials for Pinecone.                                             |
| `namespace`                           | Namespace used within the Pinecone database.                                                       |
| `fieldMapping`                        | Field mapping for text and metadata in Pinecone.                                                   |
| **RdsConfiguration**                  |                                                                                                    |
| `resourceArn`                         | The ARN of the RDS resource.                                                                       |
| `credentialsSecretArn`                | ARN of the secret containing credentials for RDS.                                                  |
| `databaseName`                        | The name of the RDS database.                                                                      |
| `tableName`                           | The name of the table in the RDS database.                                                         |
| `fieldMapping`                        | Field mapping for primary key, vector, text, and metadata fields in RDS.                           |
| **RedisEnterpriseCloudConfiguration** |                                                                                                    |
| `endpoint`                            | The endpoint for the Redis Enterprise Cloud instance.                                              |
| `vectorIndexName`                     | The name of the vector index in Redis Enterprise Cloud.                                            |
| `credentialsSecretArn`                | ARN of the secret containing credentials for Redis Enterprise Cloud.                               |
| `fieldMapping`                        | Field mapping for vector, text, and metadata fields in Redis Enterprise Cloud.                     |
