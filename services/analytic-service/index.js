import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'analytic-service',
  brokers: ['localhost:9094', 'localhost:9095', 'localhost:9096'],
});

const consumer = kafka.consumer({ groupId: 'analytic-service' });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topics: ['payment-successful', 'order-successful', 'email-successful'],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        switch (topic) {
          case 'payment-successful': {
            const value = message.value.toString();
            const { userId, cart } = JSON.parse(value);
            const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);

            console.log(`Analytic cunsumer: User ${userId} paid ${total} `);
            break;
          }
          case 'order-successful': {
            const value = message.value.toString();
            const { userId, orderId } = JSON.parse(value);
            console.log(`Analytic cunsumer: Order id ${orderId} created for User ${userId} `);
            break;
          }
          case 'email-successful': {
            const value = message.value.toString();
            const { userId, emailId } = JSON.parse(value);

            console.log(`Analytic cunsumer: email id ${emailId} sent to User ${userId} `);
            break;
          }
        }
      },
    });
  } catch (err) {
    console.log(err);
  }
};

run();
