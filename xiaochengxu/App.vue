<script>
	export default {
		onLaunch() {
			console.log('App Launch')
			uni.setStorageSync('navBarHeight', (wx.getMenuButtonBoundingClientRect().height + wx.getMenuButtonBoundingClientRect().top + 5)*2)
			uni.setStorageSync('isFullSucreen', false)
			uni.setStorageSync('sucreenHeight', (wx.getMenuButtonBoundingClientRect().height + wx.getMenuButtonBoundingClientRect().top + 5)*2+120)
			uni.setStorageSync('buttomMenuHeight', 120)
			wx.getSystemInfo({
				success: res => {
					// 根据 屏幕高度 进行判断
					if (res.screenHeight - res.safeArea.height > 40) {
						uni.setStorageSync('isFullSucreen', true)
						uni.setStorageSync('buttomMenuHeight', 180)
						uni.setStorageSync('sucreenHeight', (wx.getMenuButtonBoundingClientRect().height + wx.getMenuButtonBoundingClientRect().top + 5)*2+180)
					}
				}
			})
			this.login()
		},
		onShow() {
			console.log('App Show')
		},
		onHide() {
			console.log('App Hide')
		},
		methods: {
			login() {
				var that = this
				wx.login({
					success: res => {
						// 发送 res.code 到后台换取 token
						that.$http.login({
							code: res.code
						}).then(res => {
							if (res.status == 'SUCCESS') {
								wx.setStorageSync('userInfo', res.data)
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>