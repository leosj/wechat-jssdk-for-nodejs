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
	
	//音频接口类
	var voiceFlag = {
		isRecord: false,
		isPlaying: false
	}
	 var voices = {
	    localId: [],
	    serverId: []
	 };
	document.querySelector('#toggleVoice').onclick = function() {
		var self = this;
		if(!voiceFlag.isRecord) {
			wx.startRecord();
			self.innerText = '停止录音';
			voiceFlag.isRecord = !voiceFlag.isRecord;
			wx.onVoiceRecordEnd({
			    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
			    complete: function (res) {
			    	
					voiceFlag.isRecord = !voiceFlag.isRecord;
			    	alert('录音完成');
			        voices.localId.push(res.localId); 
					self.innerText = '开始录音';
			    }
			});
		} else {
			wx.stopRecord({
			    success: function (res) {
					voiceFlag.isRecord = !voiceFlag.isRecord;
			        voices.localId.push(res.localId);
			        alert('录音完成');
			        self.innerText = '开始录音';
			    }
			});
		}
	};
	
	document.querySelector('#togglePlayVoice').onclick = function() {
		
		if(voices.localId.length==0) {
			alert('还没有录制声音哟');
			return;
		}
		
		var self = this;
		if(!voiceFlag.isPlaying) {
			wx.playVoice({
			    localId: voices.localId[voices.localId.length-1] // 需要播放的音频的本地ID，由stopRecord接口获得
			});
			self.innerText = '暂停播放录制的音频';
			voiceFlag.isPlaying = true;
			wx.onVoicePlayEnd({
			    success: function (res) {
			        voiceFlag.isPlaying = false;
			        alert('播放完毕');
			    }
			});
		} else {
			wx.pauseVoice({
			    localId: voices.localId[voices.localId.length-1] // 需要暂停的音频的本地ID，由stopRecord接口获得
			});
			 alert('暂停播放');
			voiceFlag.isPlaying = false;
		}
	};
	
	document.querySelector('#stopPlayVoice').onclick = function() {
		if(voices.localId.length==0) {
			alert('还没有录制声音哟');
			return;
		}
		if(!voiceFlag.isPlaying) {
			alert('还没有正在播放的录制声音哟');
			return;
		}
		
		wx.stopVoice({
		    localId: voices.localId[voices.localId.length-1] // 需要暂停的音频的本地ID，由stopRecord接口获得
		});
		alert('停止播放成功');
	};
	
	//上传录音
	document.querySelector('#uploadVoice').onclick = function() {
		if(voices.localId.length == 0) {
			alert('没有录制的音频');
			return;
		}
		wx.uploadVoice({
		    localId: voices.localId[voices.localId.length-1], 
		    isShowProgressTips: 1, // 默认为1，显示进度提示
		    success: function (res) {
		        voices.serverId.push(res.serverId); 
		    }
		});
	};
	//下载录音
	document.querySelector('#downVoice').onclick = function() {
		if(voices.serverId.length == 0) {
			alert('没有录制的音频');
			return;
		}
		wx.downloadVoice({
		    serverId: voices.serverId[voices.serverId.length-1], 
		    isShowProgressTips: 1, // 默认为1，显示进度提示
		    success: function (res) {
		        voices.localId.push(res.localId); // 返回图片下载后的本地ID
		    }
		});
	};
	
	document.querySelector('#translateVoice').onclick = function() {
		if(voices.localId.length == 0) {
			alert('没有识别的音频');
			return;
		}
		wx.translateVoice({
		   localId: voices.localId[voices.localId.length-1], // 需要识别的音频的本地Id，由录音相关接口获得
		    isShowProgressTips: 1, // 默认为1，显示进度提示
		    success: function (res) {
		        alert(res.translateResult); // 语音识别的结果
		    }
		});
		
	};
});