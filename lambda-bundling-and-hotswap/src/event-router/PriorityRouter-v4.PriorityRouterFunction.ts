/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { SNSEvent } from 'aws-lambda/trigger/sns';
import { SendMessageRequest } from 'aws-sdk/clients/sqs';
import { SQS } from 'aws-sdk';
import { DateTime } from 'luxon';

export const HIGH_PRIORITY_THRESHOLD_DAYS = 'HIGH_PRIORITY_THRESHOLD_DAYS';
export const HIGH_PRIORITY_QUEUE_URL = 'HIGH_PRIORITY_QUEUE_URL';
export const NORMAL_PRIORITY_QUEUE_URL = 'NORMAL_PRIORITY_QUEUE_URL';

const sqs = new SQS();

export const handler = async (event: SNSEvent): Promise<void> => {
  console.log(JSON.stringify({ event }, null, 2));

  for await (const record of event.Records) {
    const deadlineString = record.Sns.MessageAttributes.Deadline?.Value as string;

    const isHighPriority = getIsHighPriority(deadlineString);

    const outputQueueUrl = isHighPriority
      ? process.env[HIGH_PRIORITY_QUEUE_URL]
      : process.env[NORMAL_PRIORITY_QUEUE_URL];

    if (outputQueueUrl === undefined) throw new Error('outputQueueUrl === undefined');

    const outputMessageRequest: SendMessageRequest = {
      QueueUrl: outputQueueUrl,
      MessageBody: record.Sns.Message,
    };

    const outputMessageResult = await sqs.sendMessage(outputMessageRequest).promise();

    console.log(JSON.stringify({ outputMessageResult }, null, 2));
  }
};

function getIsHighPriority(deadlineString: string): boolean {
  if (!deadlineString) {
    return false;
  }

  const deadlineDate = DateTime.fromISO(deadlineString);

  if (!deadlineDate.isValid) {
    return false;
  }

  const durationLeftDays = DateTime.now().diff(deadlineDate, 'days').days;

  console.log(JSON.stringify({ durationLeftDays }, null, 2));

  const highPriorityThresholdDays = parseInt(process.env[HIGH_PRIORITY_THRESHOLD_DAYS] ?? '0', 10);

  return durationLeftDays <= highPriorityThresholdDays;
}
