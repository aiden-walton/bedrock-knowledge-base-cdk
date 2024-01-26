import { CustomResource, RemovalPolicy, Stack } from "aws-cdk-lib";
import {
  FoundationModel,
  FoundationModelIdentifier,
} from "aws-cdk-lib/aws-bedrock";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Provider } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { join } from "path";
import { getHandlerPath } from "./get-handler-path";
import {
  BedrockKnowledgeBaseFoundationModel,
  BedrockKnowledgeBaseProps,
} from "./types";
import { Runtime } from "aws-cdk-lib/aws-lambda";

const defaultProps: Partial<BedrockKnowledgeBaseProps> = {
  removalPolicy: RemovalPolicy.DESTROY,
};

export class BedrockKnowledgeBase extends Construct {
  constructor(scope: Construct, id: string, props: BedrockKnowledgeBaseProps) {
    super(scope, id);

    const stackName = Stack.of(scope).stackName;

    const {
      stage,
      removalPolicy,
      knowledgeBaseName,
      knowledgeBaseDescription,
      knowledgeBaseRoleArn,
      knowledgeBaseStorageConfiguration,
      knowledgeBaseDataSource,
      embeddingModel,
    } = {
      ...defaultProps,
      ...props,
    };

    const foundationModel = FoundationModel.fromFoundationModelId(
      this,
      "BedrockFoundationModel",
      getFoundationModelId(embeddingModel)
    );

    const knowledgeBaseConfiguration = {
      type: "VECTOR",
      vectorKnowledgeBaseConfiguration: {
        embeddingModelArn: foundationModel.modelArn,
      },
    };

    const bedrockKnowledgeBaseCustomResourceIamRole = new Role(
      this,
      "BedrockKnowledgeBaseCustomResourceRole",
      {
        roleName: `${stackName}-bedrock-kb-custom-resource-role`,
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      }
    );

    bedrockKnowledgeBaseCustomResourceIamRole.addToPolicy(
      new PolicyStatement({
        actions: ["iam:PassRole"],
        resources: [knowledgeBaseRoleArn],
      })
    );

    bedrockKnowledgeBaseCustomResourceIamRole.addToPolicy(
      new PolicyStatement({
        actions: ["*"],
        resources: ["arn:aws:bedrock:*"],
      })
    );

    const bedrockKnowledgeBaseCustomResourceLambda = new NodejsFunction(
      this,
      "BedrockKnowledgeBaseCustomResourceLambda",
      {
        functionName: `${stackName}-bedrock-kb-custom-resource-lambda`,
        entry: getHandlerPath(join(__dirname, "custom-resource")),
        handler: "main",
        memorySize: 512,
        runtime: Runtime.NODEJS_20_X,
        role: bedrockKnowledgeBaseCustomResourceIamRole,
        environment: {
          KNOWLEDGE_BASE_NAME: knowledgeBaseName,
          KNOWLEDGE_BASE_ROLE_ARN: knowledgeBaseRoleArn,
          KNOWLEDGE_BASE_CONFIGURATION: JSON.stringify(
            knowledgeBaseConfiguration
          ),
          KNOWLEDGE_BASE_STORAGE_CONFIGURATION: JSON.stringify(
            knowledgeBaseStorageConfiguration
          ),
          KNOWLEDGE_BASE_DESCRIPTION: knowledgeBaseDescription ?? "",
          KNOWLEDGE_BASE_DATA_SOURCE_NAME:
            knowledgeBaseDataSource.dataSourceName,
          KNOWLEDGE_BASE_DATA_SOURCE_CONFIGURATION: JSON.stringify(
            knowledgeBaseDataSource.dataSourceConfiguration
          ),
        },
      }
    );

    const provider = new Provider(
      this,
      "BedrockKnowledgeBaseCustomResourceProvider",
      {
        onEventHandler: bedrockKnowledgeBaseCustomResourceLambda,
      }
    );

    new CustomResource(this, `${stage}-BedrockKnowledgeBaseCustomResource`, {
      serviceToken: provider.serviceToken,
      properties: {
        RemovalPolicy: removalPolicy,
      },
    });
  }
}

const getFoundationModelId = (
  embeddingModel: BedrockKnowledgeBaseFoundationModel
): FoundationModelIdentifier => {
  switch (embeddingModel) {
    case BedrockKnowledgeBaseFoundationModel.AMAZON_TITAN_EMBEDDINGS_G1_TEXT_V1:
      return FoundationModelIdentifier.AMAZON_TITAN_EMBEDDINGS_G1_TEXT_V1;
    case BedrockKnowledgeBaseFoundationModel.COHERE_EMBED_ENGLISH_V3:
      return FoundationModelIdentifier.COHERE_EMBED_ENGLISH_V3;
    case BedrockKnowledgeBaseFoundationModel.COHERE_EMBED_MULTILINGUAL_V3:
      return FoundationModelIdentifier.COHERE_EMBED_MULTILINGUAL_V3;
    default:
      throw new Error(`Unknown foundation model: ${embeddingModel}`);
  }
};
