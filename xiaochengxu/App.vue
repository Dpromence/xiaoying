<script>
	export default {
		onLaunch() {
			console.log('App Launch')
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