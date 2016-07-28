var wxHelper = require('./wxHelper');


exports.sign = function(url,callback){
	wxHelper.getAccessToken(function(result){
		if(result.status) {
			wxHelper.getJsapiTicket(result.accesstoken,function(jsapiticket_result){
				if(jsapiticket_result.status) {
					wxHelper.signForJsSdk(url,jsapiticket_result.jsapiticket,function(sign_result){
						console.log(sign_result);
					});
				} else {
					alert(jsapiticket_result.error);
				}
			});
		} else {
			alert(result.error);
		}
	});
};
