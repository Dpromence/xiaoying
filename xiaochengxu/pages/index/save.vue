<template>
	<view class="content">
		<!-- <view class="menuBox">
			<view class="menu" :class="type == 2?'active':''" @tap="choice(2)">图片下载</view>
			<view class="menu" :class="type == 1?'active':''" @tap="choice(1)">视频下载</view>
			<view class="menu" :class="type == 3?'active':''" @tap="choice(3)">复制文案</view>
		</view> -->
		<!-- 图片 -->
		<view class="imgBox" v-if="type==2 && res">
			<view class="img" v-for="(item,index) in res.imgs" :key="index">
				<image :src="item.imgUrl" show-menu-by-longpress='true' @tap="previewImage(index)" mode="widthFix"
					alt=""></image>
				<!-- <view class="save" @tap="saveSingle(item.imgUrl)">
					保存
				</view> -->
			</view>

		</view>
		<view class="" style="height: 160rpx;" v-if="type == 2"></view>

		<!-- #ifdef MP -->
		<view class="saveAll" v-if="type == 2">
			长按图片保存
		</view>
		<!-- #endif -->

		<!-- 视频 -->
		<view class="videoBox" v-if="type==1 ">
			<view class="video">
				<video v-if="res.downurl" :poster="res.photo" :src="res.downurl"></video>
			</view>
			<!-- #ifdef H5 -->
			<view class="button">
				视频暂不支持保存
			</view>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<!-- 	<view class="button" @tap="saveVideo(res.data.downurl)">
				保存视频
			</view> -->
			<!-- #endif -->

		</view>
		<!-- 文案 -->
		<view class="textBox" v-if="type == 3">
			<view class="text">
				{{res.data.title}}
			</view>
			<view class="button" @tap="setClipboardData(res.data.title)">
				复制文案
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				res: {},
				type: 2
			}
		},
		onLoad() {
			let data = uni.getStorageSync('data') ? uni.getStorageSync('data').data : {}
			data.type = data.type ? data.type : 2
			console.log(1111)
			if (data.type == 2) {
				this.type = 2
			} else {
				this.type = 2
			}
			data.imgs = []
			console.log(data.pics)
			if (data.type == 2) {
				for (let i in data.pics) {
					console.log(i+'-----'+data.pics[i])
					data.imgs[i] = {
						status: true,
						imgUrl: data.pics[i]
					}
				}
			} else {
				console.log(data.photo)
				data.imgs[0] = {
					status: true,
					imgUrl: data.photo
				}
			}
			console.log(data)
			this.res = data
		},
		onShow() {},
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
			previewImage(index) {
				console.log(this.res)
				let imgs = []
				for (let i in this.res.imgs) {
					imgs.push(this.res.imgs[i].imgUrl)
				}
				uni.previewImage({
					urls: imgs,
					current: index,
					loop: true
				})
			},
			choice(index) {
				this.type = index
			},
			saveAll() {
				if (!this.savePoster()) {
					return
				}
				this.savePoster().then(res => {
					if (res) {
						for (let i in this.res.data.imgs) {
							console.log(this.res.data.imgs[i].status)
							if (this.res.data.imgs[i].status) {
								this.saveImg(this.res.data.imgs[i].imgUrl).then(res => {}).catch(res => {})
							}
						}
					}
				})

			},
			saveSingle(url) {
				if (!this.savePoster()) {
					return
				}
				this.savePoster().then(res => {
					if (res) {
						this.saveImg(url).then(res => {

						}).catch(res => {

						})
					}
				})
			},
			saveVideo(url) {
				if (!url) {
					return
				}
				this.savePoster().then(res => {
					if (res) {
						this.saveImg(url).then(res => {

						}).catch(res => {

						})
					}
				}).catch(res => {})
			},
			saveVideoH5(url) {
				this.saveImg(url).then(res => {

				}).catch(res => {

				})
			},
			setClipboardData(text) {
				uni.setClipboardData({
					data: text,
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				});
			},
			uploadImgToBase64(file) {
				return new Promise((resolve, reject) => {

				})
			},

			savePoster() {
				return new Promise((resolve, reject) => {
					uni.getSetting({ //获取用户的当前设置
						success: (res) => {
							if (res.authSetting['scope.writePhotosAlbum']) { //验证用户是否授权可以访问相册
								resolve(true)
							} else {
								uni.authorize({ //如果没有授权，向用户发起请求
									scope: 'scope.writePhotosAlbum',
									success: (res) => {
										resolve(true)
									},
									fail: (res1) => {
										console.log(res1)
										uni.showModal({
											title: '提示',
											content: '请打开保存相册权限',
											duration: 3000,
											success: (res) => {
												if (res.confirm) {
													uni.openSetting({
														success: (
															res
														) => {

														},
														fail: (
															err
														) => {
															console
																.log(
																	"打开设置失败",
																	err
																)
														}
													})
												} else if (res.cancel) {
													uni.showToast({
														title: '你拒绝了授权，无法保存到相册',
														duration: 2000,
														icon: "none"
													});
													resolve(false)
												}
											}
										})
									}
								})
							}
						}
					})
				})
			},
			saveImg(url) {
				let that = this;
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '加载中',
						mask: true
					})
					if (this.type == 1) {
						console.log(url)
						uni.downloadFile({
							url: url,
							success: res => {
								console.log(res)
								uni.saveVideoToPhotosAlbum({
									filePath: res.tempFilePath,
									success: function(res1) {
										uni.hideLoading();
										uni.showToast({
											title: '保存成功',
											icon: 'none'
										})
										resolve(res1)
									},
									fail: function(err) {
										uni.hideLoading();
										uni.showToast({
											title: '保存失败',
											icon: 'none',
											duration: 5000
										})
										console.log(JSON.stringify(err))
										reject(url + JSON.stringify(err))
									}
								})
							},
							fail: err => {
								uni.hideLoading();
								uni.showToast({
									title: '视频下载失败',
									icon: 'none',
									duration: 5000
								})
								reject(url + JSON.stringify(err))
							}
						})
					} else {
						uni.getImageInfo({
							src: url,
							success: res => {
								console.log(res)
								uni.saveImageToPhotosAlbum({
									filePath: res.path,
									success: function(res1) {
										uni.hideLoading();
										uni.showToast({
											title: '保存成功',
											icon: 'none'
										})
										resolve(res1)
									},
									fail: function(err) {
										uni.hideLoading();
										uni.showToast({
											title: '保存失败',
											icon: 'none',
											duration: 5000
										})
										console.log(JSON.stringify(err))
										reject(url + JSON.stringify(err))
									}
								})
							},
							fail: err => {
								console.log(err)
								uni.hideLoading();
								uni.showToast({
									title: '图片下载失败',
									icon: 'none',
									duration: 5000
								})
								reject(url + JSON.stringify(err))
							}
						})
					}

				})
			},
			saveImageToPhotosAlbum(url) {
				console.log(url)

			},
		}
	}
</script>

<style scoped lang="scss">
	.content {
		height: 100vh;

		.saveAll {
			position: fixed;
			bottom: 60rpx;
			width: 500rpx;
			height: 68rpx;
			left: 50%;
			transform: translate(-50%, 0);
			background: #0080DF;
			box-shadow: 0rpx 6rpx 18rpx 0rpx rgba(8, 116, 195, 0.3);
			border-radius: 44rpx;
			font-size: 26rpx;
			color: #FFFFFF;
			line-height: 68rpx;
			text-align: center;
		}

		.menuBox {
			height: 88rpx;
			width: 100%;
			background: white;
			display: flex;
			justify-content: center;
			font-size: 28rpx;
			color: #999;
			line-height: 88rpx;

			.menu {
				text-align: center;
				margin: 0 20rpx;
			}

			.menu.active {
				color: #0080DF;
				position: relative;
			}

			.menu.active::after {
				content: '';
				position: absolute;
				width: 100%;
				height: 2rpx;
				background: #0080DF;
				bottom: 10rpx;
				left: 0;
			}
		}

		.imgBox {
			width: calc(100% - 40rpx);
			margin: 20rpx auto 0;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;

			.img {
				width: 350rpx;
				// height: 350rpx;
				border: 1rpx solid rgba(0, 0, 0, 0.01);
				overflow: hidden;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #F6F6F6;
				margin-bottom: 20rpx;
				position: relative;

				.choice {
					position: absolute;
					width: 40rpx;
					height: 40rpx;
					top: 10rpx;
					right: 10rpx;
					background: white;
					border-radius: 40rpx;

					img {
						width: 40rpx;
						height: 40rpx;
					}
				}

				img {
					width: 100%;
				}

				.save {
					position: absolute;
					bottom: 0;
					font-size: 24rpx;
					height: 60rpx;
					line-height: 60rpx;
					color: #fff;
					text-align: center;
					background: rgba(0, 0, 0, .7);
					width: 100%;
				}
			}
		}

		.videoBox {
			.video {
				width: calc(100% - 40rpx);
				margin: 40rpx auto 0;
				background: #000;

				// height: 350rpx;
				video {
					width: 100%;
				}
			}

			.button {
				width: 500rpx;
				height: 68rpx;
				background: rgba(0, 128, 223, 0.99);
				opacity: 0.99;
				border-radius: 44rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #FFFFFF;
				text-align: center;
				line-height: 68rpx;
				margin: 40rpx auto;
			}
		}

		.textBox {
			.text {
				width: calc(100% - 80rpx);
				margin: 40rpx auto 0;
				background: #F6F6F6;
				border-radius: 10rpx;
				padding: 20rpx;
				font-size: 26rpx;
				color: #333;
			}

			.button {
				width: 500rpx;
				height: 68rpx;
				background: rgba(0, 128, 223, 0.99);
				opacity: 0.99;
				border-radius: 44rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #FFFFFF;
				text-align: center;
				line-height: 68rpx;
				margin: 40rpx auto;
			}
		}

	}
</style>