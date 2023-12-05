<template>
	<view class="img-list" v-if="status">
		<view class="menuList">
			<view class="menu " :class="menuActive == 1?'active':''" @click="menuTap(1)">
				<img v-if="menuActive == 1" src="@/static/tabBar/index1.png" alt="">
				<img v-else src="@/static/tabBar/index.png" alt="">
				<span>首页</span>
			</view>
			<view class="menu" :class="menuActive == 2?'active':''" @click="menuTap(2)">
				<img v-if="menuActive == 2" src="@/static/tabBar/deal1.png" alt="">
				<img v-else src="@/static/tabBar/deal.png" alt="">
				<span>头像装饰</span>
			</view>
		</view>
	</view>
</template>
 
<script>
	export default {
		props: {
			menuActive: {
				
			}
		},
		data() {
			return {
				status: ''
			}
		},
		mounted() {
			this.getList()
		},
		methods: {
			getList() {
				uni.request({
					url: 'https://www.yqzbo.com/weixin/miniprogram/imgs/data.json',
					method: 'get',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					timeout: 6000,
					success: (res) => {
						this.status = res.data.isShowMenu
					}
				});
			},
			menuTap(index) {
				if (index == this.menuActive) {
					return
				}
				if (index == 1) {
					uni.redirectTo({
						url: '/pages/index/index'
					})
				}
				if (index == 2) {
					uni.redirectTo({
						url: '/pages/index/set'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.menuList {
		position: fixed;
		bottom: 0;
		width: 100%;
		display: flex;
		height: 60px;
		z-index: 100;
		align-items: center;
		background: #fff;
		border-top: 1rpx solid #f6f6f6;
		.menu {
			color: #ABABAB;
			font-size: 14px;
			text-align: center;
			flex: 1;
			height: 40px;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			span {
				display: block;
				font-size: 12px;
				width: 100%;
			}
			img {
				width: 25px;
				height: 25px;
				margin-bottom: 2px;
			}
		}
		.menu.active {
			font-size: 16px;
			color: #0080DF;
			font-weight: bold;
			position: relative;
		}
		.menu.active:before {
			// position: absolute;
			// content: '';
			// bottom: 8px;
			// left: 50%;
			// transform: translate(-50%, 0);
			// width: 25px;
			// height: 4px;
			// border-radius: 2px;
			// background: linear-gradient(to right, #27F5CE ,#6F40FF);
		}
	}
</style>
