import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { config } from "./config";

const nodeEnvIs_NOT_Prod = process.env.NODE_ENV !== "production";

config;

const developmentOptions: Redis.RedisOptions = {
  host: "localhost",
  port: 6379,
  retryStrategy: (times: any) => Math.max(times * 100, 3000),
  showFriendlyErrorStack: true,
};

const productionOptions: Redis.RedisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_INTERIOR_PORT!, 10), // parseInt(process.env.REDIS_INTERIOR_PORT!, 10),
  name: "myredis",
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: any) => Math.max(times * 100, 3000),
  showFriendlyErrorStack: true,
};

export function redisError(error: Error) {
  console.warn("redis error", {
    error,
    productionOptions,
    env: process.env.NODE_ENV,
    isNotProd: nodeEnvIs_NOT_Prod,
  });
}

export function redisReady() {
  console.log("redis is ready");
}

export const redis =
  config.env !== "production" ? new Redis(developmentOptions) : new Redis(6379, process.env.REDIS_URL); // new Redis(productionOptions);

redis.on("error", redisError);

redis.on("ready", redisReady);

const pubRedis = nodeEnvIs_NOT_Prod ? new Redis(developmentOptions) : new Redis(6379, process.env.REDIS_URL);

const subRedis = nodeEnvIs_NOT_Prod ? new Redis(developmentOptions) : new Redis(6379, process.env.REDIS_URL);

export const pubsub = new RedisPubSub({
  // ...,
  publisher: pubRedis,
  subscriber: subRedis,
});
