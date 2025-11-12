// Recommended Packages for this Lambda
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { Client } = require("@opensearch-project/opensearch");
const { AwsSigv4Signer } = require("@opensearch-project/opensearch/aws");
const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));

const openSearchEndpoint = "https://s6tkjpxuugo2q82i4z3d.eu-central-1.aoss.amazonaws.com";

const osClient = new Client({
    ...AwsSigv4Signer({
        region: "eu-central-1",
        service: 'aoss', // 'es' for managed, 'aoss' for serverless
        getCredentials: defaultProvider(),
    }),
    node: openSearchEndpoint,
});

const dynamoClient = AWSXRay.captureAWSv3Client(new DynamoDBClient());

exports.handler = async (event) => {
    console.log(JSON.stringify(event));

    const snsMessage = event.Records[0].Sns;
    let inputMessage = snsMessage.Message;
        // SNS Message is een JSON string, dus eerst parsen
    if (typeof inputMessage === "string") {
        inputMessage = JSON.parse(inputMessage);
    }
    console.log("inputMessage: ", inputMessage)
    console.log("details: ", inputMessage.detail)

    const snsMessageInfo = {
        id: snsMessage.MessageId,
        team: "htf-GoPowerRanger",
        species: inputMessage.detail.species,
        location: inputMessage.detail.location,
        intensity: inputMessage.detail.intensity,
        timestamp: inputMessage.time,             
        type: inputMessage.soortObservatie, 
    }

    console.log("message: ",inputMessage);
    console.log("snsMessages: ", snsMessageInfo)

    // Check where it should be stored

    // Call the correct message
}

async function insertIntoDynamoDB() {
    // Format the message for DynamoDB parameters (check README for indexes)
    try {
    // DynamoDB verwacht waarden in een speciaal format: { S: "string" } voor strings, { N: "123" } voor nummers
    const params = {
        TableName: "htf-2025-sonar-observations", // vervang door jouw DynamoDB tabelnaam
        Item: {
            id: { S: details.id },      // string
            name: { S: details.name },  // string
            age: { N: details.age.toString() } // nummer moet een string zijn
        }
    };

    const command = new PutItemCommand(params);
    const result = await client.send(command);
    console.log("Item toegevoegd:", result);
    } catch (error) {
        console.error("Fout bij toevoegen:", error);
    }
    // Use the `dynamoClient` to insert the record into DynamoDB
}

async function insertIntoOpenSearch() {
    // Format the message for OpenSearch parameters (check README for indexes)

    // Use the `osClient` to insert the record into OpenSearch
}
