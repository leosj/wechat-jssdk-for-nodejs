var wxConfig = require('../config/wx_config'),
	request = require('request'),
	redisClient = require('./redisDb');
var func = require('./func');

module.exports = {
	getAccessToken: function(callback){
		var callbackparam = {
			status: true
		};
		redisClient.get(wxConfig.access_cache_key, function(err, accesstoken) {  
			if (err) {  
				callbackparam.status = false;
				callbackparam.error = err+'获取redis中access失败';
				callback(callbackparam);
			} else if(accesstoken) {
				callbackparam.accesstoken = accesstoken;
				callback(callbackparam);
			} else {
				var get_access_token_url = func.printf(wxConfig.get_access_token_url,wxConfig.appid,wxConfig.appsecret);
		
				request.get(get_access_token_url,function(error,res,body){
					if (!error && res.statusCode == 200) {
						var accesstoken_result = JSON.parse(body);
						redisClient.set(wxConfig.access_cache_key, accesstoken_result.access_token, function(err, reply) {  
						    if (err) {  
						    	callbackparam.status = false;
								callbackparam.error = err+'往redis存入accesstoken失败';
						    } else {
						    	if(accesstoken_result.access_token) {
						    		callbackparam.accesstoken = accesstoken_result.access_token;
						    	} else {
						    		callbackparam.status = false;
									callbackparam.error = accesstoken_result.errmsg+'获取accesstoken失败';
						    	}
						    }
						    callback(callbackparam);
						}); 
						redisClient.expire(wxConfig.access_cache_key, accesstoken_result.expires_in/2);
						
					} else {
						callbackparam.status = false;
						callbackparam.error = error+'请求微信获取accesstoken失败';
						callback(callbackparam);
					}
				});
			}
		 }); 
	},
	getJsapiTicket: function(access_token,callback){
		var callbackparam = {
			status: true
		};
		
		redisClient.get(wxConfig.jsapiticket_cache_key, function(err, jsapiticket) {  
			if (err) {  
				callbackparam.status = false;
				callbackparam.error = err+'获取redis中jsapiticket失败';
				callback(callbackparam);
			} else if(jsapiticket) {
				callbackparam.jsapiticket = jsapiticket;
				callback(callbackparam);
			} else {
				var get_jsapiticket_url = func.printf(wxConfig.get_jsapi_ticket_url,access_token);
		
				request.get(get_jsapiticket_url,function(error,res,body){
					if (!error && res.statusCode == 200) {
						var jsapiticket_result = JSON.parse(body);
						if(jsapiticket_result.errcode == 0) {
							redisClient.set(wxConfig.jsapiticket_cache_key, jsapiticket_result.ticket, function(err, reply) {  
							    if (err) {  
							    	callbackparam.status = false;
									callbackparam.error = err+'往redis存入jsapiticket失败';
							    } else {
							    	callbackparam.jsapiticket = jsapiticket_result.ticket;
							    }
							    callback(callbackparam);
							}); 
							redisClient.expire(wxConfig.jsapiticket_cache_key, jsapiticket_result.expires_in/2);
						} else {
							callbackparam.status = false;
							callbackparam.error = jsapiticket_result.errmsg;
							callback(callbackparam);
						}
					} else {
						callbackparam.status = false;
						callbackparam.error = error+'请求微信获取jsapiticket失败';
						callback(callbackparam);
					}
				});
			}
		 });
	},
	getTokenByCode: function(code,callback) {
		var callbackparam = {
			status: true
		};
		
		redisClient.get(wxConfig.access_for_auth_cache_key, function(err, accesstoken) {  
			if (err) {  
				callbackparam.status = false;
				callbackparam.error = err+'获取redis中accesstoken_auth失败';
				callback(callbackparam);
			} else if(accesstoken) {
				callbackparam.accesstoken = accesstoken;
				callback(callbackparam);
			} else {
				var get_token_by_code_url = func.printf(wxConfig.get_token_by_code_url,wxConfig.appid,wxConfig.appsecret,code);
		
				request.get(get_token_by_code_url,function(error,res,body){
					if (!error && res.statusCode == 200) {
						var access_result = JSON.parse(body);
						if(access_result.errcode) {
							callbackparam.status = false;
							callbackparam.error = access_result.errmsg;
							callback(callbackparam);
							
						} else {
							redisClient.set(wxConfig.access_for_auth_cache_key, access_result.access_token, function(err, reply) {  
							    if (err) {  
							    	callbackparam.status = false;
									callbackparam.error = err+'往redis存入access_token_auth失败';
							    } else {
							    	callbackparam.access_token = access_result.access_token;
							    	callbackparam.openid = access_result.openid;
							    	callbackparam.scope = access_result.scope;
							    	callbackparam.unionid = access_result.unionid;
							    }
							    callback(callbackparam);
							}); 
							redisClient.expire(wxConfig.access_for_auth_cache_key, access_result.expires_in/2);
						}
					} else {
						callbackparam.status = false;
						callbackparam.error = error+'请求微信获取access_token_auth失败';
						callback(callbackparam);
					}
				});
			}
		 });
	}
	getUserInfoByAuthCode: function(accesstoken,openid){
		var callbackparam = {
			status: true
		};
		
		var get_user_info_by_auth_token_url = func.printf(wxConfig.get_user_info_by_auth_token_url,accesstoken,openid);
		
		request.get(get_user_info_by_auth_token_url,function(error,res,body){
			if (!error && res.statusCode == 200) {
				var userinfo = JSON.parse(body);
				if(userinfo.errcode) {
					callbackparam.status = false;
					callbackparam.error = userinfo.errmsg;
					callback(callbackparam);
				} else {
					callbackparam.userinfo = userinfo;
					callback(callbackparam);
				}
			} else {
				callbackparam.status = false;
				callbackparam.error = error+'请求微信获取userinfo失败';
				callback(callbackparam);
			}
		});
	},
	signForJsSdk: function(url,jsapiticket,callback) {
		
		var callbackparam = {
		    jsapi_ticket: jsapiticket,
		    nonceStr: Math.random().toString(36).substr(2, 15),
		    timestamp: parseInt(new Date().getTime() / 1000) + '',
		    url: url
		};
		
		var keys = Object.keys(callbackparam);
		  keys = keys.sort()
		  var newArgs = {};
		  keys.forEach(function (key) {
		    newArgs[key.toLowerCase()] = callbackparam[key];
		  });
		
		  var string = '';
		  for (var k in newArgs) {
		    string += '&' + k + '=' + newArgs[k];
		  }
		  string = string.substr(1);
		  
		  var sha1 = require('sha1');
		  callbackparam.signature = sha1(string);
		callback(callbackparam);
	}
	
};
