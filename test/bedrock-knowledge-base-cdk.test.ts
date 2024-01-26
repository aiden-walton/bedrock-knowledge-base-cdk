import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { BedrockKnowledgeBase } from "../lib";
import { BedrockKnowledgeBaseFoundationModel } from "../lib/types";

describe("Given the BedrockKnowledgeBase construct", () => {
  describe("When the construct is created", () => {
    let stack: Stack;

    beforeAll(() => {
      const app = new App();

      stack = new Stack(app, "test-stack");

      new BedrockKnowledgeBase(stack, "MyTestConstruct", {
        stage: "test",
        region: "us-east-1",
        knowledgeBaseName: "test-kb",
        knowledgeBaseRoleArn: "arn:aws:iam::123456789012:role/test-role",
        knowledgeBaseStorageConfiguration: {
          type: "PINECONE",
          pineconeConfiguration: {
            connectionString: "test-connection-string",
            credentialsSecretArn:
              "arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret",
            namespace: "test-namespace",
            fieldMapping: {
              textField: "test-text-field",
              metadataField: "test-metadata-field",
            },
          },
        },
        embeddingModel:
          BedrockKnowledgeBaseFoundationModel.AMAZON_TITAN_EMBEDDINGS_G1_TEXT_V1,
        knowledgeBaseDataSource: {
          dataSourceName: "test-data-source",
          dataSourceConfiguration: {
            type: "S3",
            s3Configuration: {
              bucketArn: "arn:aws:s3:::test-bucket",
              inclusionPrefixes: ["test-prefix"],
            },
          },
        },
      });
    });

    test("then a custom resource lambda function is created", () => {
      const template = Template.fromStack(stack);

      template.resourceCountIs("AWS::CloudFormation::CustomResource", 1);

      template.hasResourceProperties("AWS::Lambda::Function", {
        FunctionName: `${stack.stackName}-bedrock-kb-custom-resource-lambda`,
        Handler: "index.main",
      });
    });
  });
});
