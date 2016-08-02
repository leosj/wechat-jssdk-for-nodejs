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
		
		wxHelper.getAccessToken(function(result){
			if(result.status) {
				wxHelper.getJsapiTicket(result.accesstoken,function(jsapiticket_result){
					if(jsapiticket_result.status) {
						wxHelper.signForJsSdk(url,jsapiticket_result.jsapiticket,function(sign_result){
							data.noncestr = sign_result.nonceStr;
							data.timestamp = sign_result.timestamp;
							data.signature = sign_result.signature;
	  						res.render('jssdk', data);
						});
					} else {
						data.error = jsapiticket_result.error;
	  					res.render('jssdk', data);
					}
				});
			} else {
				data.error = result.error;
				res.render('getuserinfo', data);
			}
		});
	});
}