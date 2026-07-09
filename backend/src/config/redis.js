const {createClient}=require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'marine-mature-varied-49265.db.redis.io',
        port: 16145
    }
});

module.exports= redisClient;
