import AWS, { SQS } from 'aws-sdk';

const sqs = new AWS.SQS({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.SQS_REGION,
  apiVersion: '2012-11-05'
});

const queueUrl = process.env.SQS_QUEUE_URL!;

export const sendMessage = async (MessageGroupId: string, message: object) => {
  const params: SQS.Types.SendMessageRequest = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
    MessageGroupId
  };

  await sqs.sendMessage(params).promise();
};

export const receiveMessage = async () => {
  const params: SQS.Types.ReceiveMessageRequest = {
    AttributeNames: ['SentTimestamp'],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: ['All'],
    QueueUrl: queueUrl,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
  };

  // Receive message
  const data = await sqs.receiveMessage(params).promise();

  const hasMessage = (data.Messages?.length || 0) > 0;

  // Delete message from queue
  if (hasMessage) {
    await deleteMessage(data.Messages![0].ReceiptHandle!);
  }

  return hasMessage ? JSON.parse(data.Messages![0].Body!) : null;
};

const deleteMessage = async (receiptHandle: string) => {
  const params: SQS.Types.DeleteMessageRequest = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle
  };

  await sqs.deleteMessage(params).promise();
};
