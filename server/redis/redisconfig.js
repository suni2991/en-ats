const redis = require("redis");

let client;
async function getClient() {
  if (!client) {
    client = redis.createClient();
    client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });
  }
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

let subscribeClient;
async function getSubscribeClient() {
  if (!subscribeClient) {
    subscribeClient = redis.createClient();
    subscribeClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });
  }
  if (!subscribeClient.isOpen) {
    await subscribeClient.connect();
  }
  return subscribeClient;
}

module.exports = { getClient, getSubscribeClient };
