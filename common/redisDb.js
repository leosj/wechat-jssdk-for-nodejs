var redis = require("redis"),//召唤redis  
/* 
    连接redis数据库，createClient(port,host,options); 
    如果REDIS在本机，端口又是默认，直接写createClient()即可 
  redis.createClient() = redis.createClient(6379, '127.0.0.1', {}) 
*/  
client = redis.createClient(6379,'127.0.0.1',{});  
//如果需要验证，还要进行验证  
//client.auth(password, callback);  
  
client.on("error", function (err) {  
    console.log("Redis Error " + err);  
});  

module.exports = client;