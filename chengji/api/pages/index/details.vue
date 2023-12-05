<template>
	<view class="content">
		<view class="" style="height: 80rpx;text-align: center;line-height: 80rpx;font-size: 32rpx;font-weight: bold;">
			{{userName}}分数
		</view>
		<!-- <view class="code">
			<img :src="imgSrc" alt="">
		</view> -->
		<view class="menuList">
			<view class="button" @tap="change(1)" :class="acticeIndex == 1?'active':''">
				总分
			</view>
			<view class="button" @tap="change(2)" :class="acticeIndex == 2?'active':''">
				语文
			</view>
			<view class="button" @tap="change(3)" :class="acticeIndex == 3?'active':''">
				数学
			</view>
			<view class="button" @tap="change(4)" :class="acticeIndex == 4?'active':''">
				英语
			</view>
			<view class="button" @tap="change(5)" :class="acticeIndex == 5?'active':''">
				物理
			</view>
		</view>
		<view class="" style="width: calc(100% - 60rpx);margin: 0 auto;margin-top: 40rpx;">
			<view class="progressBox" v-if="acticeIndex == 1">
				<view class="progress" v-for="(item, index) in zongfen" :key="index">
					<view class="title">
						{{item.title}}
						<span style="color: #f73131;font-weight: 700;margin-left: 10rpx;margin-right: 10rpx;font-size: 30rpx;">{{item.count}}/{{item.total}}分</span>
						(年排<span style="color: #f73131;font-weight: 700;">{{item.paiming}}名</span>)
						
					</view>
					<view class="">
						<view class="rect">
							<view class="num" :style="'width:'+((950 - item.paiming) * 100/ 950).toFixed(0)+'%'"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="progressBox" v-else-if="acticeIndex == 2">
				<view class="progress" v-for="(item, index) in yuwen" :key="index">
					<view class="title">
						{{item.title}}
						<span style="color: #f73131;font-weight: 700;margin-left: 10rpx;margin-right: 10rpx;font-size: 30rpx;">{{item.count}}/{{item.total}}分</span>
						(年排<span style="color: #f73131;font-weight: 700;">{{item.paiming}}名</span>)
					</view>
					<view class="" style="display: flex;">
						<view class="rect">
							<view class="num" :style="'width:'+((950 - item.paiming) * 100/ 950).toFixed(0)+'%'"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="progressBox" v-else-if="acticeIndex == 3">
				<view class="progress" v-for="(item, index) in shuxue" :key="index">
					<view class="title">
						{{item.title}}
						<span style="color: #f73131;font-weight: 700;margin-left: 10rpx;margin-right: 10rpx;font-size: 30rpx;">{{item.count}}/{{item.total}}分</span>
						(年排<span style="color: #f73131;font-weight: 700;">{{item.paiming}}名</span>)
					</view>
					<view class="" style="display: flex;">
						<view class="rect">
							<view class="num" :style="'width:'+((950 - item.paiming) * 100/ 950).toFixed(0)+'%'"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="progressBox" v-else-if="acticeIndex == 4">
				<view class="progress" v-for="(item, index) in yingyu" :key="index">
					<view class="title">
						{{item.title}}
						<span style="color: #f73131;font-weight: 700;margin-left: 10rpx;margin-right: 10rpx;font-size: 30rpx;">{{item.count}}/{{item.total}}分</span>
						(年排<span style="color: #f73131;font-weight: 700;">{{item.paiming}}名</span>)
					</view>
					<view class="" style="display: flex;">
						<view class="rect">
							<view class="num" :style="'width:'+((950 - item.paiming) * 100/ 950).toFixed(0)+'%'"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="progressBox" v-else-if="acticeIndex == 5">
				<view class="progress" v-for="(item, index) in wuli" :key="index">
					<view class="title">
						{{item.title}}
						<span style="color: #f73131;font-weight: 700;margin-left: 10rpx;margin-right: 10rpx;font-size: 30rpx;">{{item.count}}/{{item.total}}分</span>
						(年排<span style="color: #f73131;font-weight: 700;">{{item.paiming}}名</span>)
					</view>
					<view class="" style="display: flex;">
						<view class="rect">
							<view class="num" :style="'width:'+((950 - item.paiming) * 100/ 950).toFixed(0)+'%'"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<canvas canvas-id="qrcode" class="codeImg"></canvas>
	</view>
</template>

<script>
	import UQrcode from './uqrcode.js'
	export default {
		data() {
			return {
				details: {},
				userName: '',
				acticeIndex: '1',
				zongfen: [],
				yuwen: [],
				shuxue: [],
				yingyu: [],
				wuli: [],
				imgSrc: ''
			}
		},
		onLoad(options) {
			let data = uni.getStorageSync('dataList')
			let id = options.id
			console.log(id)
			this.getData(id)
		},
		methods: {
			getData(id) {
				this.$http.getStudentScore({
					studentId: id
				}).then(res => {
					console.log(res)
					if (res.code == '200') {
						console.log(res.data)
					}
				})
			},
			change(index) {
				this.acticeIndex = index
			}
		}
	}
</script>

<style lang="less" scoped>
	.codeImg {
		width: 400rpx;
		height: 400rpx;
		position: absolute;
		left: -200%;
	}
	.code {
		width: 400rpx;
		height: 400rpx;
		margin: 0 auto;
		margin-bottom: 20rpx;
		img {
			width: 400rpx;
			height: 400rpx;
		}
	}
	.menuList {
		width: 100%;
		display: flex;
		.button {
			width: 20%;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;
			font-size: 28rpx;
			color: #333;
		}
		.button.active {
			color: #000;
			font-weight: bold;
			font-size: 30rpx;
		}
	}
	.progressBox {
		width: 100%;
		.progress  {
			width: 100%;
			// display: flex;
			// align-items: center;
			margin-bottom: 30rpx;
			.title {
				font-size: 26rpx;
				color: #101010;
				margin-bottom: 20rpx;
			}
			.rect {
				flex: 1;
				height: 20rpx;
				border-radius: 10rpx;
				background: #eee;
				position: relative;
				overflow: hidden;
				.num {
					width: 0%;
					position: absolute;
					top: 0;
					left: 0;
					height: 20rpx;
					background: #42b983;
					border-radius: 10rpx;
					animation: all 0.3s;
				}
			}
			.grade {
				width: 120rpx;
				font-size: 28rpx;
				margin-left: 10rpx;
			}
		}
	}
</style>
