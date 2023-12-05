<template>
	<view class="content">
		<view class="title">
			1.在APP中打开想要下载的图片或者视频，点击<span>【分享按钮】</span>
		</view>
		<img src="https://ci.xiaohongshu.com/spectrum/1040g0k030rovkersio005pa21as38ovt2vg98a0?imageView2/2/w/0/format/jpg/v3" mode="widthFix" alt="">
		<view class="title">
			2.在弹出的分享菜单中点击<span>【复制链接】</span>
		</view>
		<img src="https://ci.xiaohongshu.com/spectrum/1040g0k030rovkeut2e005pa21as38ovt1ipb750?imageView2/2/w/0/format/jpg/v3" mode="widthFix" alt="">
		<view class="title">
			3.打开小程序，点击<span>【粘贴并解析】</span>
		</view>
		<img src="https://ci.xiaohongshu.com/spectrum/1040g0k030rovkeq12m005pa21as38ovtnbgs6gg?imageView2/2/w/0/format/jpg/v3" mode="widthFix" alt="">
		<view class="title">
			4.解析成功！选择你要保存的视频或者图片
		</view>
		<view class="button" @tap="setClipboardData">
			仍有问题？联系客服
		</view>
		<view class="" style="height: 100rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {

		},
		onShareAppMessage() {
			return {
				title: '小萤去水印', //分享标题 这个可以根据业务需求去定义
				path: '/pages/index/index' //例如：path: 'page/home/index'
			}
		},
		onShareTimeline() {
			return {
				title: '小萤去水印', //分享标题 这个可以根据业务需求去定义
				path: '/pages/index/index' //例如：path: 'page/home/index'
			}
		},
		methods: {
			setClipboardData(text) {
				uni.setClipboardData({
					data: '15298079909',
					success: function () {
						uni.showToast({
							title: '微信复制成功',
							icon: 'none'
						})
					}
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.content {
		height: 100vh;
		width: calc(100% - 40rpx);
		margin: 0 auto;
		padding-top: 20rpx;
		.title {
			font-size: 28rpx;
			font-weight: bold;
			color: #000;
			margin: 20rpx 0;
			span {
				color: #0080DF;
			}
		}
		img {
			width: 100%;
		}
		.button {
			width: 400rpx;
			height: 60rpx;
			background: #0080DF;
			color: #fff;
			line-height: 60rpx;
			text-align: center;
			font-size: 18rpx;
			margin: 60rpx auto 0;
		}
	}
</style>