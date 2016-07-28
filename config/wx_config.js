module.exports = {
	appid: 'wx36ba1929abf37aa4',
	appsecret:'d0228ed69e61e63c8727591fb0c05f4d',
	access_cache_key: 'wx_accesstoken',
	jsapiticket_cache_key: 'wx_jsapiticket',
	get_access_token_url:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}',
	get_jsapi_ticket_url:'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={0}&type=jsapi'
};
