# Kafka Microservices Learning

A hands-on learning project demonstrating Apache Kafka with a microservices architecture using KRaft mode (no Zookeeper).

## Architecture Overview

This project simulates an e-commerce flow with the following services:

- **Payment Service** → Publishes to `payment-successful` topic
- **Order Service** → Publishes to `order-successful` topic  
- **Email Service** → Publishes to `email-successful` topic
- **Analytic Service** → Consumes from all topics for analytics
- **Client** → Next.js frontend application

## Kafka Cluster Setup

The project uses a **3-broker Apache Kafka cluster** running in KRaft mode (Kafka without Zookeeper):

- **Broker 1**: `localhost:9094`
- **Broker 2**: `localhost:9095`
- **Broker 3**: `localhost:9096`
- **Kafka UI**: `http://localhost:8080`

### Topics Configuration

All topics are created with:
- **3 partitions** for parallel processing
- **Replication factor of 3** for high availability

## Prerequisites

- Docker & Docker Compose
- Node.js (v18 or higher recommended)
- npm or yarn

## Getting Started

### 1. Start Kafka Cluster

```bash
cd services/kafka
docker-compose up -d
```

**⏱️ Important**: Wait 30-60 seconds for the KRaft cluster to initialize before proceeding.

### 2. Create Kafka Topics

```bash
cd services/kafka
node admin.js
```

You should see output confirming the topics were created:
```
Available topics: [ 'email-successful', 'payment-successful', 'order-successful' ]
```

### 3. Verify Cluster Health

Open Kafka UI at `http://localhost:8080` to verify:
- All 3 brokers are online
- Topics are created with correct partitions and replication

### 4. Start All Services

**Option 1: Manual (separate terminals)**
```bash
# Terminal 1 - Payment Service
cd services/payment-service && node index.js

# Terminal 2 - Order Service  
cd services/order-service && node index.js

# Terminal 3 - Email Service
cd services/email-service && node index.js

# Terminal 4 - Analytic Service
cd services/analytic-service && node index.js

# Terminal 5 - Client
cd services/client && npm run dev
```

**Option 2: One-liner (all services in background)**
```bash
cd services && \
node payment-service/index.js & \
node order-service/index.js & \
node email-service/index.js & \
node analytic-service/index.js & \
cd client && npm run dev
```

## Project Structure

```
services/
├── kafka/                  # Kafka cluster configuration
│   ├── docker-compose.yml  # 3-broker KRaft cluster setup
│   └── admin.js           # Topic creation script
├── payment-service/       # Kafka producer trigged by API 'POST'
├── order-service/         # Kafka consumer and producer
├── email-service/         # Kafka consumer and producer
├── analytic-service/      # Kafka consumer (multi-topic)
└── client/               # Next.js frontend
```

## Troubleshooting

### "This server does not host this topic-partition" Error

This error occurs when:
1. Topics haven't been created yet → Run `node admin.js`
2. Cluster isn't fully initialized → Wait 30-60 seconds after `docker-compose up`

### Brokers Closing Connections Immediately

The KRaft cluster needs time to:
- Start all broker processes
- Elect a controller
- Form the quorum

**Solution**: Wait at least 30 seconds after starting the cluster.

### Clean Restart

To completely reset the Kafka cluster:
```bash
cd services/kafka
docker-compose down -v  # Removes volumes and data
docker-compose up -d
# Wait 30-60 seconds
node admin.js
```

### Check Broker Logs

```bash
docker logs kafka-broker1
docker logs kafka-broker2  
docker logs kafka-broker3
```

## Useful Commands

```bash
# View running containers
docker ps

# Stop Kafka cluster
cd services/kafka && docker-compose down

# View Kafka UI
open http://localhost:8080

# List topics (using kafkajs admin)
cd services/kafka && node -e "
import('kafkajs').then(({Kafka}) => {
  const kafka = new Kafka({brokers: ['localhost:9094']});
  const admin = kafka.admin();
  admin.connect()
    .then(() => admin.listTopics())
    .then(console.log)
    .finally(() => admin.disconnect());
});
"
```

## Learning Resources

- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [KRaft Mode](https://kafka.apache.org/documentation/#kraft)
- [KafkaJS Documentation](https://kafka.js.org/)

## Notes

- **KRaft Mode**: This setup uses Kafka's new KRaft consensus protocol (no Zookeeper required)
- **Development Setup**: All services use `localhost` for broker connections
- **Production Considerations**: For production, you'd want proper authentication, SSL/TLS, and monitoring

## License

MIT - This is a learning project
