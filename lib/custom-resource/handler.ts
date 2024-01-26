import {
  BedrockAgentClient,
  CreateDataSourceCommand,
  CreateKnowledgeBaseCommand,
  DataSourceConfiguration,
  KnowledgeBaseConfiguration,
  StorageConfiguration,
} from "@aws-sdk/client-bedrock-agent";
import {
  CloudFormationCustomResourceDeleteEvent,
  CloudFormationCustomResourceEvent,
  CloudFormationCustomResourceUpdateEvent,
} from "aws-lambda";
import { ulid } from "ulid";
import { getEnvVariable, getEnvVariableOrDefault } from "./env-helpers";

const bedrockAgentClient = new BedrockAgentClient();

const knowledgeBaseName = getEnvVariable("KNOWLEDGE_BASE_NAME");
const knowledgeBaseRoleArn = getEnvVariable("KNOWLEDGE_BASE_ROLE_ARN");
const knowledgeBaseConfiguration = JSON.parse(
  getEnvVariable("KNOWLEDGE_BASE_CONFIGURATION")
) as KnowledgeBaseConfiguration;
const knowledgeBaseStorageConfiguration = JSON.parse(
  getEnvVariable("KNOWLEDGE_BASE_STORAGE_CONFIGURATION")
) as StorageConfiguration;
const knowledgeBaseDescription = getEnvVariableOrDefault(
  "KNOWLEDGE_BASE_DESCRIPTION",
  ""
);
const knowledgeBaseDataSourceName = getEnvVariable(
  "KNOWLEDGE_BASE_DATA_SOURCE_NAME"
);
const knowledgeBaseDataSourceConfiguration = JSON.parse(
  getEnvVariable("KNOWLEDGE_BASE_DATA_SOURCE_CONFIGURATION")
) as DataSourceConfiguration;

export const main = async (event: CloudFormationCustomResourceEvent) => {
  switch (event.RequestType) {
    case "Create":
      return await onCreate();
    case "Update":
      return await onUpdate(event as CloudFormationCustomResourceUpdateEvent);
    case "Delete":
      return await onDelete(event as CloudFormationCustomResourceDeleteEvent);
    default:
      throw new Error("Unknown request type");
  }
};

const onCreate = async () => {
  const physicalResourceId = `BedrockKnowledgeBase-${ulid()}`;

  const knowledgeBaseResponse = await bedrockAgentClient.send(
    new CreateKnowledgeBaseCommand({
      name: knowledgeBaseName,
      roleArn: knowledgeBaseRoleArn,
      knowledgeBaseConfiguration: knowledgeBaseConfiguration,
      storageConfiguration: knowledgeBaseStorageConfiguration,
      description:
        knowledgeBaseDescription !== "" ? knowledgeBaseDescription : undefined,
    })
  );

  const knowledgeBase = knowledgeBaseResponse.knowledgeBase;

  if (knowledgeBase === undefined) {
    console.error("Error creating knowledge base.", knowledgeBaseResponse);
    throw new Error("Error creating knowledge base.");
  }

  const dataSourceResponse = await bedrockAgentClient.send(
    new CreateDataSourceCommand({
      name: knowledgeBaseDataSourceName,
      knowledgeBaseId: knowledgeBase.knowledgeBaseId,
      dataSourceConfiguration: knowledgeBaseDataSourceConfiguration,
    })
  );

  const dataSource = dataSourceResponse.dataSource;

  if (dataSource === undefined) {
    console.error("Error creating data source.", dataSourceResponse);
    throw new Error("Error creating data source.");
  }

  return {
    PhysicalResourceId: physicalResourceId,
    Data: {
      knowledgeBaseId: knowledgeBase.knowledgeBaseId,
      knowledgeBaseArn: knowledgeBase.knowledgeBaseArn,
      dataSourceId: dataSource.dataSourceId,
    },
  };
};

const onUpdate = async (event: CloudFormationCustomResourceUpdateEvent) => {
  return {
    PhysicalResourceId: event.PhysicalResourceId,
  };
};

const onDelete = async (event: CloudFormationCustomResourceDeleteEvent) => {
  return {
    PhysicalResourceId: event.PhysicalResourceId,
  };
};
