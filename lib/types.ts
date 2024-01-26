import { RemovalPolicy } from "aws-cdk-lib";

export enum BedrockKnowledgeBaseFoundationModel {
  AMAZON_TITAN_EMBEDDINGS_G1_TEXT_V1,
  COHERE_EMBED_ENGLISH_V3,
  COHERE_EMBED_MULTILINGUAL_V3,
}

export interface BedrockKnowledgeBaseProps {
  stage: string;
  region: string;
  removalPolicy?: RemovalPolicy;
  knowledgeBaseName: string;
  knowledgeBaseDescription?: string;
  knowledgeBaseRoleArn: string;
  knowledgeBaseStorageConfiguration: BedrockKnowledgeBaseStorageConfiguration;
  embeddingModel: BedrockKnowledgeBaseFoundationModel;
  knowledgeBaseDataSource: BedrockKnowledgeBaseDataSource;
}

export interface BedrockKnowledgeBaseStorageConfiguration {
  type: "PINECONE" | "OPENSEARCH_SERVERLESS" | "RDS" | "REDIS_ENTERPRISE_CLOUD";
  opensearchServerlessConfiguration?: OpenSearchServerlessConfiguration;
  pineconeConfiguration?: PineconeConfiguration;
  rdsConfiguration?: RdsConfiguration;
  redisEnterpriseCloudConfiguration?: RedisEnterpriseCloudConfiguration;
}

export interface BedrockKnowledgeBaseDataSource {
  dataSourceName: string;
  dataSourceConfiguration: BedrockKnowledgeBaseDataSourceConfiguration;
}

export interface BedrockKnowledgeBaseDataSourceConfiguration {
  type: "S3";
  s3Configuration: {
    bucketArn: string;
    inclusionPrefixes?: string[];
  };
}

interface OpenSearchServerlessFieldMapping {
  vectorField: string;
  textField: string;
  metadataField: string;
}

interface OpenSearchServerlessConfiguration {
  collectionArn: string;
  vectorIndexName: string;
  fieldMapping: OpenSearchServerlessFieldMapping;
}

interface PineconeConfiguration {
  connectionString: string;
  credentialsSecretArn: string;
  namespace: string;
  fieldMapping: {
    textField: string;
    metadataField: string;
  };
}

interface RdsConfiguration {
  resourceArn: string;
  credentialsSecretArn: string;
  databaseName: string;
  tableName: string;
  fieldMapping: {
    primaryKeyField: string;
    vectorField: string;
    textField: string;
    metadataField: string;
  };
}

interface RedisEnterpriseCloudConfiguration {
  endpoint: string;
  vectorIndexName: string;
  credentialsSecretArn: string;
  fieldMapping: {
    vectorField: string;
    textField: string;
    metadataField: string;
  };
}
