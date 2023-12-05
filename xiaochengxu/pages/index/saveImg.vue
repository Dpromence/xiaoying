<template>
	<view class="content">
		<view class="navBar" :style="{height: navBarHeight+'px'}"></view>
		<navBar title="头像保存" :dark="false"></navBar>
		<view class="img" style="margin-top: 40rpx;">
			<img :src="img" alt="" @tap="previewImage" class="img" show-menu-by-longpress='true'>
		</view>
		<view class="button" style="font-size: 28rpx;margin-top: 30rpx;color: #666;text-align: center;">长按图片保存头像</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				img: '',
				navBarHeight: wx.getMenuButtonBoundingClientRect().height + wx.getMenuButtonBoundingClientRect().top + 5,
			}
		},
		onLoad(options) {
			this.img = options.img
		},
		onShareAppMessage() {
			return {
				title: '小萤去水印，头像装饰', //分享标题 这个可以根据业务需求去定义
				path: '/pages/index/set' //例如：path: 'page/home/index'
			}
		},
		onShareTimeline() {
			return {
				title: '小萤去水印，头像装饰', //分享标题 这个可以根据业务需求去定义
				path: '/pages/index/set' //例如：path: 'page/home/index'
			}
		},
		methods: {
			previewImage() {
				uni.previewImage({
					urls: [this.img],
					current: 0,
					loop: true
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.content {
		height: 100vh;
		width: calc(100% - 40rpx);
		margin: 0 auto;
		padding-top: 0rpx;
		.img {
			width: 600rpx;
			height: 600rpx;
			margin: 0rpx auto 0;
			border-radius: 10rpx;
			overflow: hidden;
			border: 1rpx solid #eee;
			img {
				width: 600rpx;
				height: 600rpx;
			}
		}
	}
</style>