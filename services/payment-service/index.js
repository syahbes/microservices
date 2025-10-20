import express from 'express';
import cors from 'cors';
import { Kafka } from 'kafkajs';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());

const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: ['localhost:9094'],
});

const producer = kafka.producer();

const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log('Producer conncted!');
  } catch (err) {
    console.log('Error connecting to Kafka', err);
  }
};

app.post('/payment-service', async (req, res) => {
  const { cart } = req.body;
  //Assume that we get the cookie and decrypt the user id
  const userId = '123';

  // TODO:PAYMENT
  console.log('API enndpoinnt hit!');
  // KAFKA
  await producer.send({
    topic: 'payment-successful',
    messages: [{ value: JSON.stringify({ userId, cart }) }],
  });

  return res.status(200).send('Payment successful');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

app.listen(8000, () => {
  connectToKafka();
  console.log('Payment service is running on port 8000');
});
