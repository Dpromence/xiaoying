<template>
	<view class="content">
		<!-- <view class="navBar" :style="{height: navBarHeight+'px'}"></view>
		<navBar title="小萤去水印" :leftIcon="false" :dark="false"></navBar> -->
		<view class="banner">
			<swiper class="swiper" style="height: 389rpx;">
				<swiper-item item-id="A">
					<img src="https://ci.xiaohongshu.com/spectrum/1040g0k030rovketdig005pa21as38ovtmgnlnog?imageView2/2/w/0/format/jpg/v3" mode="widthFix" alt="">
				</swiper-item>
			</swiper>
		</view>
		<view class="box">
			<textarea v-model="value" @confirm="confirm" confirm-type="done" placeholder="请输入视频(或图集)链接"></textarea>
		</view>
		<view class="tips" style="color: #FF5722;" @tap="tips">
			不知道怎么获取链接？点击这里，查看教程
		</view>
		<view class="des">
			tips:常用平台视频/图片在线去水印解析下载。
		</view>
		<!-- #ifdef H5 -->
		<view class="buttons">
			<view class="button" @tap="submit">
				一键解析
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP -->
		<view class="buttons">
			<view class="button" @tap="confirm1">
				{{value?'一键解析':'粘贴并解析'}}
			</view>
			<view class="button clear" @tap="getClipboardData">
				{{clipboarStatus?'粘贴内容':'清空内容'}}
			</view>
		</view>
		<!-- #endif -->
		<bottomMenu :menuActive='1'></bottomMenu>
	</view>
</template>

<script>
	import bottomMenu from "@/components/bottomMenu/bottomMenu.vue"
	export default {
		components: {
			bottomMenu
		},
		data() {
			return {
				video: '',
				value: '',
				imgs: [],
				navBarHeight: wx.getMenuButtonBoundingClientRect().height + wx.getMenuButtonBoundingClientRect().top + 5,
				healthtip: {
					content: ''
				},
				clipboarStatus: true
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
			tips() {
				uni.navigateTo({
					url: '/pages/index/tips'
				})
			},
			getClipboardData() {
				let that = this
				if (that.clipboarStatus) {
					that.clipboarStatus = false
					uni.getClipboardData({
						success(res) {
							console.log(res.data)
							if (res.data) {
								uni.showToast({
									title: '粘贴成功',
									icon: 'none'
								})
								// that.value = res.data
							}
						},
						fail(res) {
							console.log(res)
						}
					})
				} else {
					that.clipboarStatus = true
					that.value = ''
				}

			},
			confirm() {
				let that = this
				uni.setStorageSync('data', '')
				if (that.value) {
					that.submit()
				}
			},
			confirm1() {
				let that = this
				uni.setStorageSync('data', '')
				uni.getClipboardData({
					success(res) {
						uni.showToast({
							title: '粘贴成功',
							icon: 'none'
						})
						// that.value = res.data
						that.submit()
					},
					fail(res) {
						console.log(res)
					}
				})
			},
			submit() {
				if (!this.value) {
					uni.showToast({
						title: '请输入链接',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '加载中...'
				})
				for (let i = 0; i < 1; i++) {
					console.log(this.value)
					this.$http.create({
						url: this.value,
						userId: uni.getStorageSync('userInfo').userId,
						openId: uni.getStorageSync('userInfo').openId,
					}).then(res => {
						uni.hideLoading()
						console.log(res)
						if (res.code == '200' || res.code == '100') {
							if (res.code == 200) {
								res.data.pics = res.data.images.length>0?res.data.images:res.data.cover
							} else {
								res.data.pics = res.data.pics.length>0?res.data.pics:res.data.photo
							}
							uni.setStorageSync('data', res)
							this.value = ''
							uni.navigateTo({
								url: '/pages/index/save'
							})
						} else {
							wx.showToast({
								title: res.message,
								icon: 'none'
							})
						}
					})
				}

			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		height: 100vh;
		background: #fff;
		overflow: hidden;

		.banner {
			width: calc(100% - 60rpx);
			margin: 20rpx auto 20rpx;
			border-radius: 10rpx;
			overflow: hidden;

			img {
				width: 100%;
				border-radius: 10rpx;
			}
		}

		.des {
			font-size: 24rpx;
			color: #888;
			width: calc(100% - 60rpx);
			margin: 20rpx auto 40rpx;
			text-align: justify;
		}

		.box {
			width: calc(100% - 60rpx);
			margin: 0rpx auto 0;
			height: 180rpx;
			border: 1rpx solid #0080DF;
			border-radius: 10rpx;
			background: white;

			textarea {
				width: calc(100% - 20rpx);
				height: calc(100% - 20rpx);
				padding: 10rpx;
				font-size: 26rpx;
			}
		}
		.tips {
			width: calc(100% - 60rpx);
			margin: 20rpx auto 0;
			font-size: 28rpx;
			color: #0080DF;
			font-weight: bold;
		}

		.buttons {
			width: calc(100% - 60rpx);
			margin: 40rpx auto 0;
			display: flex;
			justify-content: center;

			.button {
				font-size: 28rpx;
				font-weight: 500;
				color: #FEFEFE;
				width: 226rpx;
				height: 64rpx;
				background: #0080DF;
				box-shadow: 0rpx 6rpx 18rpx 0rpx rgba(8, 116, 195, 0.3);
				border-radius: 32rpx;
				text-align: center;
				line-height: 64rpx;
			}

			.clear {
				margin-left: 40rpx;
				background: #06ADC6;
			}

		}

		.video {
			width: calc(100% - 60rpx);
			margin: 40rpx auto 0;

			video {
				width: 100%;
			}

			.button {
				width: 626rpx;
				height: 88rpx;
				background: rgba(0, 128, 223, 0.99);
				opacity: 0.99;
				border-radius: 44rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #FFFFFF;
				text-align: center;
				line-height: 88rpx;
				margin: 40rpx auto;
			}
		}
	}
</style>