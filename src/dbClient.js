var redis = require("redis");
const configure = require('./configure')

const config = configure()

const redisUrl = process.env.REDIS_URL

var db = redis.createClient(
  redisUrl
    ? {
        url: redisUrl,
        tls: redisUrl.startsWith('rediss://'),
        retry_strategy: () => {
          return new Error("Retry time exhausted")
        }
      }
    : {
        host: config.redis.host,
        port: config.redis.port,
        retry_strategy: () => {
          return new Error("Retry time exhausted")
        }
      }
)

process.on('SIGINT', function() {
  db.quit();
});

module.exports = db