module.exports = {
	appid: 'wx36ba1929abf37aa4',
	appsecret:'d0228ed69e61e63c8727591fb0c05f4d',
	access_cache_key: 'wx_accesstoken',
	jsapiticket_cache_key: 'wx_jsapiticket',
	access_for_auth_cache_key: 'wx_accesstoken_for_auth',
	get_access_token_url:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}',
	get_jsapi_ticket_url:'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={0}&type=jsapi',
	get_auth_code_url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid={0}&redirect_uri={1}&response_type=code&scope={2}&state={3}#wechat_redirect',
	get_token_by_code_url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}&secret={1}&code={2}&grant_type=authorization_code',
	get_user_info_by_auth_token_url: 'https://api.weixin.qq.com/sns/userinfo?access_token={0}&openid={1}&lang=zh_CN',
	refresh_token_url: 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid={0}&grant_type=refresh_token&refresh_token={1}'

};
