<template>
	<view class="content">
		<view class="navBar" :style="{height: navBarHeight+'px'}"></view>
		<navBar title="更多壁纸" :leftIcon="false" :dark="false"></navBar>
		<view class="">
			<scroll-view class="scroll-view_H" :scroll-y="true" :style="{height: 'calc(100vh - '+(sucreenHeight)+'rpx)'}">
				<view class="listBox">
					<view class="list" v-for="(item, index) in list" :key="index">
						<view class="img">
							<image :src="item.url" mode="widthFix"></image>
						</view>
						<view class="title">
							{{item.title}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
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
				list: [],
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
				this.$http.getImgs({
					page: 1,
					pageSize: 10
				}).then(res => {
					console.log(res)
					if (res.code == '200' || res.code == '100') {
						for (let i in res.data) {
							var randomNumber = Math.floor(Math.random() * (JSON.parse(res.data[i].imgs).length - 1) + 1);
							res.data[i].imgs = JSON.parse(res.data[i].imgs)
							res.data[i].url = res.data[i].imgs[randomNumber]
						}
						this.list = res.data
					}
					
					
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
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
					height: 450rpx;
					overflow: hidden;
					border-radius: 10rpx;
					image {
						width: 100%;
					}
					margin-bottom: 20rpx;
				}
				.title {
					font-size: 24rpx;
					color: #1a1a1a;
					font-weight: bold;
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