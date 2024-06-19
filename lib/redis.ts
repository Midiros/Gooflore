import Redis from "ioredis";


let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  throw new Error("REDIS_URL is not defined, provide me one.");
}

export default redis;
