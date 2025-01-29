const amqp = require("amqplib");

let channel;
let connection;

// Connect to RabbitMQ
const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
};

// Publish a message to a queue
const publishToQueue = async (queueName, message) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel is not initialized.");
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Message published to queue: ${queueName}`);
  } catch (error) {
    console.error("Error publishing to RabbitMQ:", error);
  }
};

// Consume messages from a queue
const consumeFromQueue = async (queueName, callback) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel is not initialized.");
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, (message) => {
      if (message !== null) {
        callback(JSON.parse(message.content.toString()));
        channel.ack(message);
      }
    });
    console.log(`Started consuming from queue: ${queueName}`);
  } catch (error) {
    console.error("Error consuming from RabbitMQ:", error);
  }
};

// Close connection
const closeRabbitMQ = async () => {
  try {
    await channel.close();
    await connection.close();
    console.log("RabbitMQ connection closed");
  } catch (error) {
    console.error("Error closing RabbitMQ connection:", error);
  }
};

module.exports = {
  connectRabbitMQ,
  publishToQueue,
  consumeFromQueue,
  closeRabbitMQ,
};
