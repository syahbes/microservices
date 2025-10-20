import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'kafka-service',
  brokers: ['localhost:9094', 'localhost:9095', 'localhost:9096'],
});

const admin = kafka.admin();

const run = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      { topic: 'payment-successful', numPartitions: 3, replicationFactor: 3 },
      { topic: 'order-successful', numPartitions: 3, replicationFactor: 3 },
      { topic: 'email-successful', numPartitions: 3, replicationFactor: 3 },
    ],
  });

  const topics = await admin.listTopics();
  console.log('Aviable topics', topics);
  await admin.disconnect();
};

run();
