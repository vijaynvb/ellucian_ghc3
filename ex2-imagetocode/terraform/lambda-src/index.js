const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const tableName = process.env.TASKS_TABLE_NAME;

  // Handles direct list requests and AppSync invoke payloads.
  const field = event?.field || "listTasks";

  if (field === "createTask") {
    const task = event.arguments?.input;

    await ddb.send(
      new PutCommand({
        TableName: tableName,
        Item: task,
      })
    );

    return task;
  }

  const scanResult = await ddb.send(
    new ScanCommand({
      TableName: tableName,
    })
  );

  return scanResult.Items || [];
};
