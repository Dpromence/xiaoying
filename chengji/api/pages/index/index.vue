<template>
	<view class="content">
		<view class="text-area" @tap="toPage(item.studentId, item.idCard)" v-for="(item, index) in list" :key="index">
			{{item.studentName}}
		</view>
	</view>
</template>

<script>
	import data from '../../json/data.json'
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
			this.getData1()
		},
		methods: {
			getData1() {
				this.$http.getStudent({
					classId: 1
				}).then(res => {
					console.log(res)
					if (res.code == '200') {
						let data = res.data
						data.sort((a, b) => a['studentName'].localeCompare(b['studentName']))
						this.list = data
					}
				})
			},
			getData(url) {
				let array = []
				for (let i in data) {
					array.push({
						id: data[i].id,
						name: data[i].name,
						subjectId: 4,
						examId: 5,
						remake: '初二上半期物理',
						score: data[i].wuli5,
						rank: data[i].wuliPaiming5,
						idCard: data[i].idCard,
					})
				}
				console.log(JSON.stringify(array))
				uni.request({
					// url: 'http://127.0.0.1:8888/student/getOne', // 导入学生信息
					url: 'http://127.0.0.1:8888/student/score', // 导入学生
					method: 'post',
					header: {
						// 'Content-Type' : 'application/json',
						token: 'token',
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						data: JSON.stringify(array)
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
				// uni.navigateTo({
				// 	url: '/pages/index/details?id=' + id
				// })
				uni.showModal({
					title: '请输入学生身份证后四位查看成绩',
					content: '',
					editable: true, //是否显示输入框
					placeholderText: '请输入身份证后四位', //输入框提示内容
					confirmText: '确认',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							console.log(res.content)
							if (res.content.toUpperCase() == idCard.substr(-4).toUpperCase()) {
								uni.navigateTo({
									url: '/pages/index/details?id=' + id
								})
							} else {
								uni.showToast({
									title: '身份证后四位不匹配',
									icon: 'none'
								})
							}
						}
					}
				});
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