var wxConfig = require('../config/wx_config'),
	wxHelper = require('../common/wxHelper'),
	func = require('../common/func'),
	localStorage =  require('../common/localStorage');


module.exports = function(app){
	app.get('/getuserinfo', function(req, res, next) {
		var data = {
			title : 'nodejs微信获取用户信息示例',
			seoDesp: 'nodejs微信获取用户信息示例desp',
			seoKeywords:'nodejs，微信获取用户信息',
			error:''
		};
		//首先判断当前本地存储中是否有用户信息
		var wx_openid = localStorage.getItem(res,req,'wx_openid');
		
		if(!wx_openid) { //本地存储的openid为空，获取openid
			if(req.query.code) {
				
				wxHelper.getTokenByCode(req.query.code,false,function(token_result){
					if(token_result.status) {
						localStorage.setItem(res,req,'wx_openid',token_result.openid.toString());//存储openid到本地
						//获取用户基本信息
						wxHelper.getUserInfoByAuthCode(token_result.access_token,token_result.openid,function(userinfo_result){
							if(userinfo_result.status) {
								localStorage.setItem(res,req,'wx_userinfo_for_'+token_result.openid,JSON.stringify(userinfo_result.userinfo));
								data.userinfo = userinfo_result.userinfo;
							} else {
								data.error = userinfo_result.error;
							}
							res.render('getuserinfo', data);
						});
					} else {
						data.error = token_result.error;
						res.render('getuserinfo', data);
					}
				});
				
			} else {
				var redirecturl = req.protocol + '://' + req.hostname + req.originalUrl; //获取当前url
				var get_auth_code_url = func.printf(wxConfig.get_auth_code_url,wxConfig.appid,redirecturl,'snsapi_userinfo','leosj');
				res.redirect(get_auth_code_url);
			}
		} else {
			var userinfo = localStorage.getItem(res,req,'wx_userinfo_for_'+wx_openid);
			
			if(userinfo === null) { //直接重新获取，用refresh_token显得麻烦
				var redirecturl = req.protocol + '://' + req.hostname + req.originalUrl; //获取当前url
				var get_auth_code_url = func.printf(wxConfig.get_auth_code_url,wxConfig.appid,redirecturl,'snsapi_userinfo','leosj');
				localStorage.removeItem('wx_openid');
				res.redirect(get_auth_code_url);
			} else {
				data.userinfo = JSON.parse(userinfo);
				res.render('getuserinfo', data);
			}
		}
		
	});
}