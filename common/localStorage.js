module.exports = {
	getItem: function(res,req,key) {
		var sessionItem,cookieItem;
		if(typeof(req.session[key]) != 'undefined' && req.session[key]) {
			return sessionItem = req.session[key];
		} else if(typeof(req.cookies[key]) != 'undefined' && req.cookies[key]) {
			return cookieItem = req.cookies[key];
		} else {
			return '';
		}
		
	},
	setItem: function(res,req,key,value) {
		req.session[key] = value;
		res.cookie(key,value,{ maxAge: 60*60*24*1000,httpOnly:true, path:'/'});
	},
	removeItem: function(res,req,key) {
		req.session[key] = '';
		res.cookie(key, "", {maxAge:0});
	}
};