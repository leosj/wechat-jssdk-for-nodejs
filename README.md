#wechat-jssdk-for-nodejs
##用nodejs书写微信sdk的示例

缓存数据库用的是redis，accesstoken以及jsapiticket都存放在这里面

##主要示例
参考http://yoururl/jssdk

![](http://7xjjef.com1.z0.glb.clouddn.com/github-leosj-jssdk1.jpg)
![](http://7xjjef.com1.z0.glb.clouddn.com/github-leosj-jssdk2.jpg)
###<h4>一、图片类相关接口</h4>

1、拍照或从手机相册中选图接口

2、预览图片接口

3、上传图片接口(演示上传选中最后一张图片)

4、下载图片接口(演示下载刚刚上传的图片)
###<h4>二、界面类操作</h4>
1、显示/隐藏右上角菜单接口

2、关闭当前网页窗口接口

3、批量显示/隐藏功能按钮接口

4、显示/隐藏所有非基础按钮接口

###<h4>三、音频类接口</h4>
1、开始/停止录音

2、播放/暂停录制的录音

3、停止播放录音

4、上传/下载录音

5、识别语音

###<h4>四、其他接口</h4>
1、查看网络制

2、获取位置

###<h4>五、遇到的坑</h4>
*  微信demo示例中签名算法使用的是jssha，但是jssha在1.6版本以上就不支持

```javascript
shaObj = new jsSHA(string, 'TEXT');
```
*  这样的写法了
所以用的require('sha1')

##网页授权获取用户信息
参考http://yoururl/getuserinfo

![](http://7xjjef.com1.z0.glb.clouddn.com/github-leosj-getuserinfo.jpg)

获取用户openid后缓存到本地，用session和cookie存放，然后避免一直调用接口，虽然接口调用次数不限，但一直让用户授权还是不好的

##有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(393068657#qq.com, 把#换成@)
* QQ: 393068657