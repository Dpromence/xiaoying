<template>
	<view class="content">
		<view class="text-area" @tap="toPage(item.id, item.idCard)" v-for="(item, index) in list" :key="index">
			{{item.name}}
		</view>
	</view>
</template>

<script>
	import data from '../../json/data2.json'
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad(options) {
			let url = 'https://www.yqzbo.com/weixin/miniprogram/imgs/zhangyu/data.json'
			if (options.id == 2) {
				url = 'https://www.yqzbo.com/weixin/miniprogram/imgs/zhangyu/data2.json'
			}
			this.getData(url)
		},
		methods: {
			getData(url) {
				uni.request({
					url: url,
					method: 'get',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					timeout: 6000,
					success: (res) => {
						console.log(res)
						let data = res.data
						data.sort((a, b) => a['name'].localeCompare(b['name']))
						this.list = data
						uni.setStorageSync('dataList', data)
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
			toPage(id, idCard) {
				console.log(idCard.substr(-4))
				uni.navigateTo({
					url: '/pages/index/details?id=' + id
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		padding-top: 20rpx;
	}
	textarea {
		font-size: 28rpx !important;
	}
	.text-area {
		height: 80rpx;
		width: 160rpx;
		background: #42b983;
		text-align: center;
		line-height: 80rpx;
		margin-bottom: 20rpx;
		margin-right: 10rpx;
		margin-left: 10rpx;
		color: #fff;
	}
</style>