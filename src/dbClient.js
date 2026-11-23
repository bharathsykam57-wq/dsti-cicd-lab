var redis = require("redis");
const configure = require('./configure');

const config = configure();
const redisUrl = process.env.REDIS_URL;

const options = redisUrl
  ? {
      url: redisUrl,
      tls: {},
      retry_strategy: (options) => {
        console.error("Redis connection retry:", options.error?.message);
        return Math.min(options.attempt * 1000, 10000);
      }
    }
  : {
      host: config.redis.host,
      port: config.redis.port,
      retry_strategy: () => {
        return new Error("Retry time exhausted");
      }
    };

var db = redis.createClient(options);

db.on("connect", () => {
  console.log("Redis connection established");
});

db.on("ready", () => {
  console.log("Redis client ready");
});

process.on('SIGINT', function() {
  db.quit();
});

module.exports = db;