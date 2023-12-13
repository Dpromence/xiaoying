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
// const baseUrl = 'https://eeapi.cn'; // 正式
// const baseUrl = 'http://127.0.0.1:3000'; // 正式
const baseUrl = 'https://www.9877nba.cc'; // 正式
// const baseUrl = 'https://gongju.yyymvp.com'; // 正式


function request(method, url, data) {
	if (!data) {
		data = {}
	}
	return new Promise((resolve, reject) => {
		let header = {
			'Content-Type': 'application/x-www-form-urlencoded'
		};
		wx.request({
			url: baseUrl + url,
			method: method,
			header: header,
			data: data,
			success: (res) => {
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
	getVideo: (data) => request(GET, '/api/video/32972AFB515F4A7F82859DE59DB8794DD0CF4459F8ACABA26E/4474/', data), //登录
	getVideo1: (data) => request(GET, '/query', data), //登录
	create: (data) => request(POST, '/users/getResoult', data), // 查询数据
	login: (data) => request(GET, '/users/addUser', data), //登录
	getCount: (data) => request(GET, '/users/getCount', data), //获取今日调用量
	getImgs: (data) => request(GET, '/users/getImgs', data), //获取图片列表
	history: (data) => request(GET, '/users/history', data), //获取图片列表历史
	
};
export default {
	Api
};