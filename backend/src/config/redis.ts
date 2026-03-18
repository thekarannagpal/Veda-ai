import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

let redisConnection: Redis;

if (redisUrl) {
  redisConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
  });
} else {
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
  redisConnection = new Redis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
  });
}

redisConnection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redisConnection;
