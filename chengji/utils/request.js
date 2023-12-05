/**
  * 
  * @Description: 云启智控
  * @author: 961146965@qq.com
  * @createTime: 2023-06-01 16:44:37
  * @Copyright by 途优泊
  * 
  **/

const GET = 'GET';
const POST = 'POST';

// const baseUrl = 'https://yqzb.tuyoubo.com'; 
const baseUrl = 'http://127.0.0.1:8888'; // 正式

function request(method, url, data) {
	if (!data) {
		data = {}
	}
	return new Promise((resolve, reject) => {
		let header = {
			'Content-Type': 'application/x-www-form-urlencoded',
			token: uni.getStorageSync("token") ? uni.getStorageSync("token") : ''
		};
		data.token = uni.getStorageSync("token") ? uni.getStorageSync("token") : ''
		wx.request({
			url: baseUrl + url,
			method: method,
			header: header,
			data: data,
			success: (res) => {
				if (res.data.status == 'ERROR') {
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 3000
					})
				} else if (res.data.status == 'NOT_LOGIN') {
					uni.showToast({
						title: '登陆过期',
						icon: 'none',
						duration: 2000
					})
					uni.redirectTo({
						url: '/pagesLogin/pages/login/login'
					})
				}
				resolve(res.data);
				// SUCCESS为成功标识，NOT_LOGIN表示登陆过期或者未登录，ERROR表示错误，具体错误信息见msg
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}
const Api = {
	getStudent: (data) => request(POST, '/student/getStudent', data), //获取学生列表
	getStudentScore: (data) => request(POST, '/student/getStudentScore', data), //获取学生分数
};
export default {
	Api
};