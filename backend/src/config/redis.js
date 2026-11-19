const {createClient}=require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'kick-straight-chivalrous-32078.db.redis.io',
        port: 10636
    }
});

module.exports= redisClient;

