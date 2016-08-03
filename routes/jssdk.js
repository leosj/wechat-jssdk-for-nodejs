var wxConfig = require('../config/wx_config'),
	wxHelper = require('../common/wxHelper');

module.exports = function(app){
	app.get('/jssdk', function(req, res, next) {
		var data = {
			title : 'nodejs微信JSSDK示例',
			seoDesp: 'nodejs微信JSSDK示例desp',
			seoKeywords:'nodejs，微信JSSDK',
			appid : wxConfig.appid,
			error:''
		};
		var url = req.protocol + '://' + req.hostname + req.originalUrl; //获取当前url
		
		wxHelper.getAccessToken().then(function(accesstoken){
			return wxHelper.getJsapiTicket(accesstoken);
		}).then(function(jsapiticket){
			return wxHelper.signForJsSdk(url,jsapiticket);
		}).then(function(sign_result){
			data.noncestr = sign_result.nonceStr;
			data.timestamp = sign_result.timestamp;
			data.signature = sign_result.signature;
	  		res.render('jssdk', data);
		}).catch(function(err){
			data.error = err;
			res.render('commonerror', data);
		});
	});
}