"use strict";

const wxConfig = require('../config/wx_config'),
	request = require('request'),
	func = require('./func'),
	redisClient = require('./redisDb'),
	Promise = require('es6-promise').Promise;


module.exports = {
	getAccessToken: function(){	
		return new Promise(function(resolve,reject){
			redisClient.get(wxConfig.access_cache_key, function(err, accesstoken) { 
				if (err) {  
					reject( err+'获取redis中access失败');
				} else if(accesstoken) {
					resolve(accesstoken);
				} else {
					let get_access_token_url = func.printf(wxConfig.get_access_token_url,wxConfig.appid,wxConfig.appsecret);
					request.get(get_access_token_url,function(error,res,body){	 
						if (!error && res.statusCode == 200) {
							let accesstoken_result = JSON.parse(body);
						
							if(typeof(accesstoken_result.errcode) == "undefined"){
								redisClient.set(wxConfig.access_cache_key, accesstoken_result.access_token, function(err, reply) {  
								    if (err) {  
								    	reject(err+'往redis存入accesstoken失败');
								    } else {
								    	resolve(accesstoken_result.access_token);
								    }
								}); 
							} else {
								reject(accesstoken_result.errmsg);
							}
						} else {
							reject(error+'请求微信获取accesstoken失败');
						}
					});
				}
			});
		});
	},
	getJsapiTicket: function(access_token){
		return new Promise(function(resolve,reject){
			redisClient.get(wxConfig.jsapiticket_cache_key, function(err, jsapiticket) {  
				if (err) {  
					reject(err+'获取redis中jsapiticket失败');
				} else if(jsapiticket) {
					resolve(jsapiticket);
				} else {
					let get_jsapiticket_url = func.printf(wxConfig.get_jsapi_ticket_url,access_token);
			
					request.get(get_jsapiticket_url,function(error,res,body){
						if (!error && res.statusCode == 200) {
							let jsapiticket_result = JSON.parse(body);
							if(jsapiticket_result.errcode == 0){
								redisClient.set(wxConfig.jsapiticket_cache_key, jsapiticket_result.ticket, function(err, reply) {  
								    console.log(err);
								    if (err) {
										reject(err+'往redis存入jsapiticket失败');
								    } else {
								    	resolve(jsapiticket_result.ticket);
								    }
								}); 
								redisClient.expire(wxConfig.jsapiticket_cache_key, jsapiticket_result.expires_in/2);
							} else {
								reject(jsapiticket_result.errmsg);
							}
						} else {
							reject(error+'请求微信获取jsapiticket失败');
						}
					});
				}
			 });
		});
	},
	getTokenByCode: function(code,fromstorefirst) {
		return new Promise(function(resolve,reject){
			redisClient.get(wxConfig.access_for_auth_cache_key, function(err, accesstoken) {  
				if (err) {  
					reject(err+'获取redis中accesstoken_auth失败');
				} else if(accesstoken && fromstorefirst) {
					let callbackparam = {
						access_token: accesstoken.access_token,
						refresh_token:accesstoken.refresh_token
					};
					
					resolve(callbackparam);
				} else {
					let get_token_by_code_url = func.printf(wxConfig.get_token_by_code_url,wxConfig.appid,wxConfig.appsecret,code);
			
					request.get(get_token_by_code_url,function(error,res,body){
						if (!error && res.statusCode == 200) {
							let access_result = JSON.parse(body);
							if(typeof(access_result.errcode) != "undefined"){
								reject(access_result.errmsg);
							} else {
								let storeContent = {
									access_token:access_result.access_token,
									refresh_token:access_result.refresh_token
								};
								redisClient.set(wxConfig.access_for_auth_cache_key, storeContent, function(err, reply) {  
								    if (err) {  
								    	reject(err+'往redis存入access_token_auth失败');
								    } else {
								    	let callbackparam = {};
								    	callbackparam.access_token = access_result.access_token;
								    	callbackparam.refresh_token = access_result.refresh_token;
								    	callbackparam.openid = access_result.openid;
								    	callbackparam.scope = access_result.scope;
								    	callbackparam.unionid = access_result.unionid;
								    	resolve(callbackparam);
								    }
								}); 
								redisClient.expire(wxConfig.access_for_auth_cache_key, access_result.expires_in/2);
							}
						} else {
							reject(error+'请求微信获取access_token_auth失败');
						}
					});
				}
			 });
		});
		
	},
	getUserInfoByAuthCode: function(accesstoken,openid){
		return new Promise(function(resolve,reject){
			let get_user_info_by_auth_token_url = func.printf(wxConfig.get_user_info_by_auth_token_url,accesstoken,openid);
			let callbackparam = {};
			request.get(get_user_info_by_auth_token_url,function(error,res,body){
				if (!error && res.statusCode == 200) {
					let userinfo = JSON.parse(body);
					if(typeof(userinfo.errcode) != "undefined"){
						reject(userinfo.errmsg);
					} else {
						callbackparam.userinfo = userinfo;
						resolve(callbackparam);
					}
				} else {
					reject(error+'请求微信获取userinfo失败');
				}
			});
		});
	},
	refreshAuthToken: function(refresh_token) {
		return new Promise(function(resolve,reject){
			let callbackparam = {};
			let refresh_token_url = func.printf(wxConfig.refresh_token_url,wxConfig.appid,refresh_token);
		
			request.get(refresh_token_url,function(error,res,body){
				if (!error && res.statusCode == 200) {
					let refreshresult = JSON.parse(body);
					if(typeof(refreshresult.errcode) != "undefined"){
						reject(refreshresult.errmsg);
					} else {
						let storeContent = {
							access_token:refreshresult.access_token,
							refresh_token:refreshresult.refresh_token
						};
						redisClient.set(wxConfig.access_for_auth_cache_key, storeContent, function(err, reply) {  
								if (err) {  
									reject(err+'往redis存入access_token_auth失败');
								} else {
								    callbackparam.access_token = refreshresult.access_token;
								    callbackparam.refresh_token = refreshresult.refresh_token;
								    callbackparam.openid = refreshresult.openid;
								    callbackparam.scope = refreshresult.scope;
								    resolve(callbackparam);
								 }
							}); 
						redisClient.expire(wxConfig.access_for_auth_cache_key, refreshresult.expires_in/2);
					}
				} else {
					reject(error+'请求微刷新accesstoken失败');
				}
			});
		});
	},
	signForJsSdk: function(url,jsapiticket) {
		return new Promise(function(resolve,reject){
			let callbackparam = {
			    jsapi_ticket: jsapiticket,
			    nonceStr: Math.random().toString(36).substr(2, 15),
			    timestamp: parseInt(new Date().getTime() / 1000) + '',
			    url: url
			};
			
			let keys = Object.keys(callbackparam);
			  keys = keys.sort();
			  let newArgs = {};
			  keys.forEach(function (key) {
			    newArgs[key.toLowerCase()] = callbackparam[key];
			  });
			
			  let string = '';
			  for (let k in newArgs) {
			    string += '&' + k + '=' + newArgs[k];
			  }
			  string = string.substr(1);
			  
			  let sha1 = require('sha1');
			  callbackparam.signature = sha1(string);
			resolve(callbackparam);
			//reject('签名错误');
			
		});
	}
	
};
