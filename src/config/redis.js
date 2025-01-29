// redisClient.js
const redis = require("redis");

// Redis Client'ı başlatıyoruz
const client = redis.createClient({
  url: "redis://localhost:6379", // Redis'in çalıştığı varsayılan port
});

client.on("error", (err) => console.error("Redis Client Error", err));

const connectRedis = async () => {
  await client.connect();
  console.log("Redis connected successfully!");
};

module.exports = { client, connectRedis };
