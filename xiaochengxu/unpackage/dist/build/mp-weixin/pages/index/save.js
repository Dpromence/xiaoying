(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/save"],{"0703":function(t,n,o){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o={data:function(){return{res:{},type:2}},onLoad:function(){var n=t.getStorageSync("data")?t.getStorageSync("data").data:{};if(n.type=n.type?n.type:2,console.log(1111),n.type,this.type=2,n.imgs=[],console.log(n.pics),2==n.type)for(var o in n.pics)console.log(o+"-----"+n.pics[o]),n.imgs[o]={status:!0,imgUrl:n.pics[o]};else console.log(n.photo),n.imgs[0]={status:!0,imgUrl:n.photo};console.log(n),this.res=n},onShow:function(){},onShareAppMessage:function(){return{title:"小萤去水印",path:"/pages/index/index"}},onShareTimeline:function(){return{title:"小萤去水印",path:"/pages/index/index"}},methods:{previewImage:function(n){console.log(this.res);var o=[];for(var e in this.res.imgs)o.push(this.res.imgs[e].imgUrl);t.previewImage({urls:o,current:n,loop:!0})},choice:function(t){this.type=t},saveAll:function(){var t=this;this.savePoster()&&this.savePoster().then((function(n){if(n)for(var o in t.res.data.imgs)console.log(t.res.data.imgs[o].status),t.res.data.imgs[o].status&&t.saveImg(t.res.data.imgs[o].imgUrl).then((function(t){})).catch((function(t){}))}))},saveSingle:function(t){var n=this;this.savePoster()&&this.savePoster().then((function(o){o&&n.saveImg(t).then((function(t){})).catch((function(t){}))}))},saveVideo:function(t){var n=this;t&&this.savePoster().then((function(o){o&&n.saveImg(t).then((function(t){})).catch((function(t){}))})).catch((function(t){}))},saveVideoH5:function(t){this.saveImg(t).then((function(t){})).catch((function(t){}))},setClipboardData:function(n){t.setClipboardData({data:n,success:function(){t.showToast({title:"复制成功",icon:"none"})}})},uploadImgToBase64:function(t){return new Promise((function(t,n){}))},savePoster:function(){return new Promise((function(n,o){t.getSetting({success:function(o){o.authSetting["scope.writePhotosAlbum"]?n(!0):t.authorize({scope:"scope.writePhotosAlbum",success:function(t){n(!0)},fail:function(o){console.log(o),t.showModal({title:"提示",content:"请打开保存相册权限",duration:3e3,success:function(o){o.confirm?t.openSetting({success:function(t){},fail:function(t){console.log("打开设置失败",t)}}):o.cancel&&(t.showToast({title:"你拒绝了授权，无法保存到相册",duration:2e3,icon:"none"}),n(!1))}})}})}})}))},saveImg:function(n){var o=this;return new Promise((function(e,i){t.showLoading({title:"加载中",mask:!0}),1==o.type?(console.log(n),t.downloadFile({url:n,success:function(o){console.log(o),t.saveVideoToPhotosAlbum({filePath:o.tempFilePath,success:function(n){t.hideLoading(),t.showToast({title:"保存成功",icon:"none"}),e(n)},fail:function(o){t.hideLoading(),t.showToast({title:"保存失败",icon:"none",duration:5e3}),console.log(JSON.stringify(o)),i(n+JSON.stringify(o))}})},fail:function(o){t.hideLoading(),t.showToast({title:"视频下载失败",icon:"none",duration:5e3}),i(n+JSON.stringify(o))}})):t.getImageInfo({src:n,success:function(o){console.log(o),t.saveImageToPhotosAlbum({filePath:o.path,success:function(n){t.hideLoading(),t.showToast({title:"保存成功",icon:"none"}),e(n)},fail:function(o){t.hideLoading(),t.showToast({title:"保存失败",icon:"none",duration:5e3}),console.log(JSON.stringify(o)),i(n+JSON.stringify(o))}})},fail:function(o){console.log(o),t.hideLoading(),t.showToast({title:"图片下载失败",icon:"none",duration:5e3}),i(n+JSON.stringify(o))}})}))},saveImageToPhotosAlbum:function(t){console.log(t)}}};n.default=o}).call(this,o("543d")["default"])},"44e1":function(t,n,o){"use strict";var e=o("d966"),i=o.n(e);i.a},"51f8":function(t,n,o){"use strict";(function(t,n){var e=o("4ea4");o("d2f7");e(o("66fd"));var i=e(o("f7f4"));t.__webpack_require_UNI_MP_PLUGIN__=o,n(i.default)}).call(this,o("bc2e")["default"],o("543d")["createPage"])},5538:function(t,n,o){"use strict";o.r(n);var e=o("0703"),i=o.n(e);for(var s in e)["default"].indexOf(s)<0&&function(t){o.d(n,t,(function(){return e[t]}))}(s);n["default"]=i.a},"91f2":function(t,n,o){"use strict";o.d(n,"b",(function(){return e})),o.d(n,"c",(function(){return i})),o.d(n,"a",(function(){}));var e=function(){var t=this.$createElement;this._self._c},i=[]},d966:function(t,n,o){},f7f4:function(t,n,o){"use strict";o.r(n);var e=o("91f2"),i=o("5538");for(var s in i)["default"].indexOf(s)<0&&function(t){o.d(n,t,(function(){return i[t]}))}(s);o("44e1");var a=o("f0c5"),c=Object(a["a"])(i["default"],e["b"],e["c"],!1,null,"7d76aabb",null,!1,e["a"],void 0);n["default"]=c.exports}},[["51f8","common/runtime","common/vendor"]]]);