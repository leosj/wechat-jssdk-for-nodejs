var shareParam = {
    title: document.title,
    desc: document.title,
    link: location.href,
    imgUrl: 'http://placekitten.com/400/400',
    sucCallback:function(type){
    	alert('分享到'+type+'成功');
    },
    cancelCallback:function(type){
    	alert('取消分享到'+type);
    }
}
function cloneObj(oldObj) { //复制对象方法
	if (typeof(oldObj) != 'object') return oldObj;
	if (oldObj == null) return oldObj;
	var newObj = new Object();
	for (var i in oldObj)
		newObj[i] = cloneObj(oldObj[i]);
	return newObj;
}
function extendObj() { //扩展对象
	var args = arguments;
	if (args.length < 2) return;
	var temp = cloneObj(args[0]); //调用复制对象方法
	for (var n = 1; n < args.length; n++) {
		for (var i in args[n]) {
			temp[i] = args[n][i];
		}
	}
	return temp;
}
function initWxShare(opt) {
	var shareObj = extendObj(shareParam, opt);
	wx.onMenuShareTimeline({ //朋友圈
		title: shareObj.title, 
		link: shareObj.link, 
		imgUrl: shareObj.imgUrl, 
		success: function () { 
			 shareObj.sucCallback('timeline');
		},
		 cancel: function () { 
			 shareObj.cancelCallback('timeline');
		}
	});
	
	wx.onMenuShareAppMessage({
	    title: shareObj.title,
	    desc: shareObj.desc, 
	    link: shareObj.link, 
	    imgUrl: shareObj.imgUrl, 
	    type: '', // 分享类型,music、video或link，不填默认为link
	    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	    success: function () { 
	         shareObj.sucCallback('app');
	    },
	    cancel: function () { 
	        shareObj.cancelCallback('app');
	    }
	});
	
	wx.onMenuShareQQ({ //分享到QQ
	    title: shareObj.title, 
	    desc: shareObj.desc, 
	    link: shareObj.link, 
	    imgUrl: shareObj.imgUrl, 
	    success: function () { 
	       shareObj.sucCallback('qq');
	    },
	    cancel: function () { 
	       shareObj.cancelCallback('qq');
	    }
	});
	
	wx.onMenuShareWeibo({ //分享到微博
	    title: shareObj.title, 
	    desc: shareObj.desc, 
	    link: shareObj.link, 
	    imgUrl: shareObj.imgUrl, 
	    success: function () { 
	        shareObj.sucCallback('weibo');
	    },
	    cancel: function () { 
	        shareObj.cancelCallback('weibo');
	    }
	});
	
	wx.onMenuShareQZone({
	    title: shareObj.title, 
	    desc: shareObj.desc, 
	    link: shareObj.link, 
	    imgUrl: shareObj.imgUrl, 
	    success: function () { 
	       shareObj.sucCallback('qzone');
	    },
	    cancel: function () { 
	        shareObj.cancelCallback('qzone');
	    }
	});
}