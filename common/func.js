module.exports = {
	printf: function() {
		var num = arguments.length;
		var oStr = arguments[0];
		for(var i = 1; i < num; i++) {
			var pattern = "\\{" + (i - 1) + "\\}";
			var re = new RegExp(pattern, "g");
			oStr = oStr.replace(re, arguments[i]);
		}
		return oStr;
	}
};