<template>
	<view class="container">
		<navBar :dark="flase" title="上传壁纸/头像"></navBar>
		<view :style="[{height: 'calc('+(navBarHeight * 2)+'rpx)'}]"></view>
		<!-- 滑动区域 -->
		<scroll-view :scroll-y="true" class="scrollY" :style="[{height: 'calc(100vh - '+(navBarHeight * 2)+'rpx)'}]">
			<view class="box">
				<view class="title" style="margin-top: 40rpx;">
					标题
				</view>
				<view class="inputBox">
					<input type="text" v-model="title" placeholder="请输入文章标题" maxlength="255">
				</view>
				<view class="title" style="margin-top: 40rpx;">
					上传壁纸/头像<span>(最多不超过18张)</span>
				</view>
				<view class="imgRect">
					<view class="list list1" v-for="(item, index) in imgList" :key="index">
						<view class="img">
							<img :src="item" @tap="check(index)" mode="widthFix" alt="">
						</view>
						<view class="close" @click.stop="del(index)">
							×
						</view>
					</view>
					<view class="list" @tap="upload1" v-if="imgList.length < 18">
						<img src="./img/upload1.png" class='upload' alt="">
						<view class="" style="width: 100%;">
							点击上传
						</view>
					</view>
				</view>

				<view class="button" @tap="submit">
					确认上传
				</view>
			</view>
			<view style="height: 130rpx;"></view>
		</scroll-view>
	</view>
</template>

<script>
	import navBar from '@/components/navBar/navBar.vue'
	export default {
		components: {
			navBar,
		},
		data() {
			return {
				title: '',
				driverPhoto: '',
				carPlate: '',
				color: '',
				id: '',
				numbers: '',
				imgList: [],
				navBarHeight: wx.getMenuButtonBoundingClientRect().height + wx.getMenuButtonBoundingClientRect().top + 5
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {},
		created() {},
		methods: {
			check(index) {
				uni.previewImage({
					current: index,
					urls: this.imgList
				});
			},
			del(index) {
				this.imgList.splice(index, 1)
			},
			upload1() {
				let that = this
				uni.chooseImage({
					count: (9 - that.imgList.length), //默认9
					sourceType: ['camera', 'album'],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: function(res) {
						uni.showLoading({
							title: 'Loading...'
						})
						console.log(res.tempFilePaths)
						for (let i in res.tempFilePaths) {
							that.fileUp(res.tempFilePaths[i])
						}
					}
				});
			},
			fileUp(tempFilePaths) {
				console.log(tempFilePaths)
				let that = this
				uni.uploadFile({
					url: 'http://127.0.0.1:3000/users/upload', //仅为示例，非真实的接口地址
					filePath: tempFilePaths,
					name: 'imageFile',
					method:'post',
					formData: {
						'userId': uni.getStorageSync('userInfo').userId,
						'openId': uni.getStorageSync('userInfo').openId
					},
					success: (uploadFileRes) => {
						let res = JSON.parse(uploadFileRes.data)
						console.log(res)
						uni.hideLoading()
						if (res.status == 'SUCCESS') {
							this.imgList.push(res.data.url)
						}
					},
					fail(e) {
						console.log(e)
					}
				});
			},
			submit() {
				if (!this.title) {
					uni.showToast({
						title: '请先输入文章标题',
						icon: 'none'
					});
					return
				}
				uni.showLoading({
					title: 'Loading...'
				})
				this.$http.write({
					title: this.title,
					'userId': uni.getStorageSync('userInfo').userId,
					'openId': uni.getStorageSync('userInfo').openId,
					detailsImages: JSON.stringify(this.imgList)
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.status == 'SUCCESS') {
						uni.showToast({
							title: '提交成功',
							icon: 'none',
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #F6F6F6;

		.box {
			width: calc(100% - 100rpx);
			margin: 0 auto;
			// background: #fff;
			border-radius: 10rpx;
			overflow: hidden;

			.title {
				font-size: 28rpx;
				font-weight: bold;
				color: #101010;

				span {
					color: #ED860B
				}
			}
			
			.inputBox {
				input {
					font-size: 24rpx;
					height: 60rpx;
					line-height: 60rpx;
					margin-top: 20rpx;
				}
			}
			
			.border {
				margin-top: 70rpx;
				border-bottom: 1px solid #F0F0F0;
			}

			.rect {
				width: calc(100% - 60rpx);
				margin: 26rpx auto 0;
				height: 320rpx;
				background: #ECF7FF;
				border: 1px solid #096FBB;
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				position: relative;
				z-index: 0;
				overflow: hidden;

				>img {
					// width: 100%;
					// height: 100%;
					position: absolute;
					// top: 0;
					// left: 0;
				}

				.upload {
					text-align: center;
					position: relative;
					z-index: 1;
					color: #0080DF;

					img {
						width: 134rpx;
						height: 134rpx;
					}
				}
			}

			.des {
				width: calc(100% - 60rpx);
				margin: 60rpx auto 58rpx;
				font-size: 28rpx;
				color: #101010;
				font-weight: bold;
				text-align: justify;
			}

			.carInfo {
				width: calc(100% - 30rpx);
				margin: 40rpx auto 36rpx;
				height: 264rpx;
				background: #F5F6F7;
				overflow: hidden;
				border-radius: 8rpx;

				.title {
					display: flex;
					align-items: center;
					margin: 40rpx 36rpx 0;
					font-size: 28rpx;
					font-weight: bold;
					color: #ED860B;

					img {
						width: 30rpx;
						height: 30rpx;
						margin-right: 5rpx;
					}
				}

				.carNo {
					padding: 0 36rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #101010;
					margin-top: 20rpx;
				}
			}

			.imgRect {
				display: flex;
				flex-wrap: wrap;
				margin-top: 30rpx;
				position: relative;

				.list1 {

					.img {
						display: flex;
						align-items: center;
						position: absolute;
						width: 100%;
						height: 100%;
						overflow: hidden;
					}
				}

				.list {
					width: 30%;
					height: 203rpx;
					background: #FAFAFA;
					border: 1rpx dashed #CFCFCF;
					border-radius: 4rpx;
					text-align: center;
					font-size: 29rpx;
					color: #5D5C5C;
					margin-right: 2.5%;
					position: relative;
					margin-bottom: 20rpx;


					.close {
						position: absolute;
						top: -13rpx;
						right: -13rpx;
						width: 26rpx;
						height: 26rpx;
						background: #000000;
						opacity: 0.6;
						border-radius: 50%;
						color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.upload {
						width: 67rpx;
						height: 56rpx;
						margin-top: 53rpx;
					}
				}
			}


			.button {
				width: 432rpx;
				height: 88rpx;
				background: #0080DF;
				box-shadow: 0rpx 6rpx 18rpx 0rpx rgba(8, 116, 195, 0.3);
				border-radius: 44rpx;
				color: #fff;
				text-align: center;
				line-height: 88rpx;
				margin: 60rpx auto 40rpx;
			}

		}


	}
</style>