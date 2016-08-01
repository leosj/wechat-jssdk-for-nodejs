var wxConfig = require('../config/wx_config'),
	wxHelper = require('../common/wxHelper'),
	func = require('../common/func');


module.exports = function(app){
	app.get('/getuserinfo', function(req, res, next) {
		var data = {
			title : 'nodejs微信获取用户信息示例',
			seoDesp: 'nodejs微信获取用户信息示例desp',
			seoKeywords:'nodejs，微信获取用户信息'
		};
		
		if(req.query.code) {
			res.render('getuserinfo', data);
		} else {
			var redirecturl = req.protocol + '://' + req.hostname + req.originalUrl; //获取当前url
			var get_auth_code_url = func.printf(wxConfig.get_auth_code_url,wxConfig.appid,redirecturl,'snsapi_userinfo','leosj');
			res.redirect(get_auth_code_url);
		}
		
	});
}