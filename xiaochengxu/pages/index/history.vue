<template>
	<view class="content">
		<view class="navBar" :style="{height: navBarHeight+'px'}"></view>
		<navBar title="历史记录" :leftIcon="false" :dark="false"></navBar>
		<view class="">
			<scroll-view class="scroll-view_H" :scroll-y="true" :style="{height: 'calc(100vh - '+(sucreenHeight)+'rpx)'}"
			   @refresherrefresh="refresherrefresh" :refresher-triggered="refreshStatus" lower-threshold="50"
				refresher-default-style="none" :refresher-enabled="true"
				@scrolltolower="lower">
				<view class="listBox">
					<view class="list" v-for="(item, index) in list" :key="index" @tap="details(index)">
						<view class="img">
							<image :src="item.url" mode="aspectFill"></image>
						</view>
						<view class="title">
							{{item.title}}
						</view>
					</view>
				</view>
				<view v-if="notNull" style="overflow: hidden;">
					<view class="" style="text-align: center;font-size: 24rpx;color: #666;text-align: center;margin-top: 80rpx;">
						您还没有历史记录呦
					</view>
					<view class="" @tap="toPage" style="width: 160rpx;height: 60rpx;background: #0080DF;font-size: 24rpx;border-radius: 40rpx;margin: 30rpx auto 0;text-align: center;color: #fff;line-height: 60rpx;">
						去解析
					</view>
				</view>
				<view class="noMore" >
					<span>{{noMore?'我也是有底线的呦~':''}}</span>
				</view>
			</scroll-view>
		</view>
		<bottomMenu :menuActive="3"></bottomMenu>
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
				notNull: false,
				page: 1,
				pageSize: 10,
				refreshStatus: false,
				list: [],
				noMore: false,
				sucreenHeight: uni.getStorageSync('sucreenHeight'),
				navBarHeight: wx.getMenuButtonBoundingClientRect().height + wx.getMenuButtonBoundingClientRect().top + 5,
			}
		},
		onLoad() {
			this.getImgs()
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
			getImgs() {
				uni.showLoading({
					title: 'loading...'
				})
				this.$http.history({
					page: this.page,
					pageSize: this.pageSize,
					userId: uni.getStorageSync('userInfo').userId
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					this.refreshStatus = false
					if (res.code == '200' || res.code == '100') {
						for (let i in res.data) {
							var randomNumber = Math.floor(Math.random() * (JSON.parse(res.data[i].imgs).length - 1) + 1);
							res.data[i].imgs = JSON.parse(res.data[i].imgs)
							res.data[i].url = res.data[i].imgs[1 - 1]
						}
						this.list = [...this.list, ...res.data]
						if (this.pageSize > res.data.length) {
							this.noMore = true
						}
						if(this.list.length <= 0) {
							this.notNull = true
						}
					}
				})
			},
			details(index) {
				let data = {
					data: {
						pics: this.list[index].imgs,
						type: 2
					}
				}
				uni.setStorageSync('data', data)
				uni.navigateTo({
					url: '/pages/index/save'
				})
			},
			toPage() {
				uni.navigateTo({
					url: "/pages/index/index"
				})
			},
			// 触发下拉刷新事件
			refresherrefresh() {
				this.refreshStatus = true
				this.page = 1
				this.noMore = false
				this.list = []
				this.getImgs()
			},
			lower() {
				if (this.noMore) {
					return
				}
				this.page++
				
				this.getImgs()
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		.noMore {
			width: 100%;
			height: 60rpx;
			color: #999;
			text-align: center;
			line-height: 60rpx;
			font-size: 24rpx;
		}
		.listBox {
			display: flex;
			width: calc(100% - 20rpx);
			flex-wrap: wrap;
			justify-content: space-between;
			margin: 0 20rpx 0 0;
			
			.list {
				width: 48%;
				margin-left: 15rpx;
				margin-bottom: 30rpx;
				.img {
					overflow: hidden;
					line-height: 0;
					border-radius: 10rpx;
					background: #f8f8f8;
					image {
						width: 100%;
					}
					margin-bottom: 10rpx;
				}
				.title {
					font-size: 24rpx;
					color: #1a1a1a;
					font-weight: 600;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;

				}
			}
		}
		
	}
</style>