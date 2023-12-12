<template>
	<view class="content" v-if="isShowMenu">
		<view class="navBar" :style="{height: navBarHeight+'px'}"></view>
		<navBar title="头像制作" :leftIcon="false" :dark="false"></navBar>
	<!-- 	<view class="choiceMenu">
			<view class="tab" @tap="choiceMenuMath(0)" :class="choiceMenuIndex == 0?'active':''">
				微信头像
			</view>
			<view class="tab" @tap="choiceMenuMath(1)" :class="choiceMenuIndex == 1?'active':''">
				抖音头像
			</view>
		</view> -->
		<!-- <img class="bg" :style="{height: (100)+'vh'}" src="./imgs/bg.png" alt=""> -->
		<view class="headImg" :class="choiceMenuIndex != 0?'cicle':''">
			<img :src="choiceImgUrl" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 2;">
			
			<img :src="headImageUrl" alt="" v-if="headImageUrl">
			<view class=""
				style="font-size: 24rpx;text-align: center;display: flex;align-items: center;width: 100%;height: 100%;justify-content: center;color: #666;"
				v-else>
				<span>点击上传头像</span>
			</view>
			<button class="avatar-wrapper" @tap="chooseImg"></button>
			<!-- <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar"></button> -->
		</view>
		
		<view>
			<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
				<view class="scroll-view-item_H" @tap="choiceImg(item.img, index)" v-for="(item, index) in imgs" :key="index">
					<image :src="item.img1" alt="" :fade-show="true" lazy-load></image>
					<img src="./imgs/2.png" class="choiceIcon" v-show="choiceImgIndex == index" alt="">
				</view>
			</scroll-view>
		</view>
		<view class="button" @tap="toPage">
			合成头像
		</view>
		<canvas canvas-id='myCanvas'
			style="opacity: 0;width: 1000px;height: 1000px;position: fixed;top: -1000%;"></canvas>
			
		<bottomMenu :menuActive="2"></bottomMenu>
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
				choiceMenuIndex: 0,
				isShowMenu: false,
				imgs: [],
				choiceImgUrl: '',
				choiceImgIndex: 0,
				saveImg: '',
				headImageUrl: '',
				navBarHeight: wx.getMenuButtonBoundingClientRect().height + wx.getMenuButtonBoundingClientRect().top + 5,
			}
		},
		onLoad() {
			this.getData()
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
			choiceMenuMath(index) {
				this.choiceMenuIndex = index
				if (index == 0) {
					this.choiceImgUrl = this.imgs[this.choiceImgIndex].img
				} else {
					this.choiceImgUrl = this.imgs[this.choiceImgIndex].img2?this.imgs[this.choiceImgIndex].img2:''
				}
			},
			getData() {
				uni.request({
					url: 'https://www.yqzbo.com/weixin/miniprogram/imgs/data.json',
					method: 'get',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					timeout: 6000,
					success: (res) => {
						console.log(res)
						this.imgs = res.data.data
						this.isShowMenu = res.data.isShowMenu
						this.choiceImgUrl = res.data.data[0].img
					},
					fail: (err) => {
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					},
					complete: () => {
						uni.hideLoading()
					},
				});
			},
			choiceImg(img, index) {
				this.choiceImgIndex = index
				if(this.choiceMenuIndex == 0) {
					this.choiceImgUrl = this.imgs[this.choiceImgIndex].img
				} else {
					this.choiceImgUrl = this.imgs[this.choiceImgIndex].img2?this.imgs[this.choiceImgIndex].img2:''
				}
			},
			toPage() {
				if (!this.headImageUrl) {
					uni.showToast({
						title: '请先上传您的头像',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.mergeImages()
			},
			chooseImg() {
				let that = this
				uni.chooseImage({
					count: 1, //count: 6, //默认9
					sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success(res) {
						that.headImageUrl = res.tempFilePaths[0]
					}
				});
			},
			mergeImages() {
				uni.showLoading({
					title: '正在生成头像，请稍等...'
				})
				const ctx = uni.createCanvasContext('myCanvas', this);
				const img2 = this.headImageUrl;
				uni.getImageInfo({
					src: this.choiceImgUrl,
					complete: (res1) => {
						console.log(res1.path)
						uni.getImageInfo({
							src: img2,
							complete: (res2) => {
								ctx.drawImage(res2.path, 0, 0, 1000, 1000); // 绘制第二张照片
								ctx.drawImage(res1.path, 0, 0, 1000, 1000); // 绘制第一张照片
								ctx.draw(false, () => {
									uni.canvasToTempFilePath({
										canvasId: 'myCanvas',
										success: (res) => {
											uni.hideLoading()
											this.saveImg = res.tempFilePath
											uni.navigateTo({
												url: '/pages/index/saveImg?img=' + this.saveImg
											})
										},
										fail() {
											uni.hideLoading()
										}
									}, this);
								})
							}
						})
					}
				})
			},
			loadImage(img) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: img,
						complete: (res) => {
							console.log(res.path)
							resolve(res.path)
						}
					})
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		height: 100vh;
		width: calc(100% - 40rpx);
		margin: 0 auto;
		padding-top: 0rpx;
		.choiceMenu {
			height: 80rpx;
			width: 100%;
			line-height: 80rpx;
			display: flex;
			// border-bottom: 1rpx solid #eee;
			.tab {
				width: 160rpx;
				font-size: 28rpx;
				color: #101010;
				text-align: center;
			}
			.tab.active {
				color: rgba(0, 128, 223, 0.99);
				position: relative;
			}
			.tab.active::before {
				content: '';
				position: absolute;
				bottom: 0;
				width: 60rpx;
				left: 50rpx;
				height: 4rpx;
				border-radius: 2rpx;
				background: rgba(0, 128, 223, 0.99);
			}
		}
		.scroll-view_H {
			white-space: nowrap;
			width: 100%;
			border-radius: 10rpx;
			overflow: hidden;

			.scroll-view-item_H {
				display: inline-block;
				width: 200rpx;
				height: 200rpx;
				background: #eee;
				border: 1rpx solid #eee;
				line-height: 0;
				border-radius: 10rpx;
				margin: 0 10rpx;
				overflow: hidden;
				position: relative;
				image {
					width: 200rpx;
					height: 200rpx;
				}
				.choiceIcon {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
					width: 30rpx;
					height: 30rpx;
				}
			}
		}

		.bg {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}

		.headImg {
			width: 600rpx;
			height: 600rpx;
			border: 1rpx solid #eee;
			border-radius: 10rpx;
			background: #eee;
			margin: 20rpx auto 30rpx;
			overflow: hidden;
			position: relative;

			.avatar-wrapper {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 0;
				z-index: 3;
			}

			img {
				width: 100%;
				height: 100%;
			}
		}
		.headImg.cicle {
			border-radius: 600rpx;
		}

		.button {
			width: 626rpx;
			height: 88rpx;
			background: rgba(0, 128, 223, 0.99);
			opacity: 0.99;
			border-radius: 44rpx;
			margin: 30rpx auto 0;
			color: #fff;
			font-size: 28rpx;
			line-height: 88rpx;
			text-align: center;
			position: relative;

		}
	}
</style>