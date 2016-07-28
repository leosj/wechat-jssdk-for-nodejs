wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: appId, // 必填，公众号的唯一标识
    timestamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: signature,// 必填，签名，见附录1
    jsApiList: [
    	'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});

wx.ready(function () {
    initWxShare({ //注册分享事件
    	title: document.title,
    	desc: document.getElementById("desp").content,
    	link: location.href,
    	imgUrl: 'http://placekitten.com/400/400',
    	sucCallback:function(type){
    		alert('分享到'+type+'成功');
    	},
    	cancelCallback:function(type){
    		alert('取消分享到'+type);
    	}
    });
    
    //图片接口类
    var images = {
	    localId: [],
	    serverId: []
	 };
	 //选择图片
    document.querySelector('#chooseImg').onclick = function () {
	    wx.chooseImage({
	      success: function (res) {
	        images.localId = res.localIds;
	        alert('已选择 ' + res.localIds.length + ' 张图片');
	      }
	    });
	};
	//预览图片
	document.querySelector('#prevImg').onclick = function() {
		var prevImages = images.localId.length>0?images.localId:[];
		if(prevImages.length==0) {
			//添加测试图片
			for(var i=0;i<10;i++) {
				prevImages.push('http://placekitten.com/'+Math.floor(Math.random()*1000+100)+'/'+Math.floor(Math.random()*1000+100));
			}
		}
		wx.previewImage({
		    current: prevImages[0], // 当前显示图片的http链接
		    urls: prevImages // 需要预览的图片http链接列表
		});
	};
	//上传图片
	document.querySelector('#uploadImg').onclick = function() {
		if(images.localId.length == 0) {
			alert('没有选择的图片');
			return;
		}
		wx.uploadImage({
		    localId: images.localId[images.localId.length-1], 
		    isShowProgressTips: 1, // 默认为1，显示进度提示
		    success: function (res) {
		        images.serverId.push(res.serverId); 
		    }
		});
	};
	//下载图片
	document.querySelector('#downloadImg').onclick = function() {
		if(images.serverId.length == 0) {
			alert('没有选择服务端的图片');
			return;
		}
		wx.downloadImage({
		    serverId: images.serverId[images.serverId.length-1], 
		    isShowProgressTips: 1, // 默认为1，显示进度提示
		    success: function (res) {
		        images.localId.push(res.localId); // 返回图片下载后的本地ID
		    }
		});
	};
	
	
	//界面操作类
	var menuShowFlag = {
		OptionMenu: true,
		MenuItems: true,
		AllNonBaseMenuItem:true
	}
	//操作右上角菜单
	document.querySelector('#toggleOptionMenu').onclick = function() {
		if(menuShowFlag.OptionMenu) {
			wx.hideOptionMenu();
			this.innerText = '显示右上角菜单';
		} else {
			wx.showOptionMenu();
			this.innerText = '隐藏右上角菜单';
		}
		menuShowFlag.OptionMenu = !menuShowFlag.OptionMenu;
	};
	//关闭界面
	document.querySelector('#closeWindow').onclick = function() {
		wx.closeWindow();
	};
	//操作功能按钮
	document.querySelector('#toggleMenuItems').onclick = function() {
		if(menuShowFlag.MenuItems) {
			wx.hideMenuItems({
			    menuList: [
					"menuItem:editTag",//编辑标签
					"menuItem:delete",//删除
					"menuItem:copyUrl",//复制链接
					"menuItem:originPage",//原网页
					"menuItem:readMode",//阅读模式
					"menuItem:openWithQQBrowser",//在QQ浏览器中打开
					"menuItem:openWithSafari",//在Safari中打开
					"menuItem:share:email",//邮件
					"menuItem:share:brand",//一些特殊公众号
					"menuItem:share:appMessage",//发送给朋友
					"menuItem:share:timeline",//分享到朋友圈
					"menuItem:share:qq",//分享到QQ
					"menuItem:share:weiboApp",//分享到Weibo
					"menuItem:favorite",//收藏
					"menuItem:share:facebook",//分享到FB
					"menuItem:share:QZone" //分享到 QQ 空间
				] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
			this.innerText = '显示功能按钮';
		} else {
			wx.showMenuItems({
			    menuList: [
					"menuItem:editTag",//编辑标签
					"menuItem:delete",//删除
					"menuItem:copyUrl",//复制链接
					"menuItem:originPage",//原网页
					"menuItem:readMode",//阅读模式
					"menuItem:openWithQQBrowser",//在QQ浏览器中打开
					"menuItem:openWithSafari",//在Safari中打开
					"menuItem:share:email",//邮件
					"menuItem:share:brand",//一些特殊公众号
					"menuItem:share:appMessage",//发送给朋友
					"menuItem:share:timeline",//分享到朋友圈
					"menuItem:share:qq",//分享到QQ
					"menuItem:share:weiboApp",//分享到Weibo
					"menuItem:favorite",//收藏
					"menuItem:share:facebook",//分享到FB
					"menuItem:share:QZone" //分享到 QQ 空间
			    ] // 要显示的菜单项，所有menu项见附录3
			});
			this.innerText = '隐藏功能按钮';
		}
		menuShowFlag.MenuItems = !menuShowFlag.MenuItems;
	};
	//操作非基础按钮
	document.querySelector('#toggleAllNonBaseMenuItem').onclick = function() {
		if(menuShowFlag.AllNonBaseMenuItem) {
			wx.hideAllNonBaseMenuItem();
			this.innerText = '显示非基础按钮';
		} else {
			wx.showAllNonBaseMenuItem();
			this.innerText = '隐藏非基础按钮';
		}
		menuShowFlag.AllNonBaseMenuItem = !menuShowFlag.AllNonBaseMenuItem;
	};
});