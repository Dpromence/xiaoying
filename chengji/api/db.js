// 引入mysql中间件
const mysql = require('mysql')
// 创建连接




function conMysql(sql) {
	//创建数据库连接池
	let Myconnect = mysql.createConnection({
		// host 数据库主机名
		host: "localhost",
		// user 用户名
		user: "root",
		// password 密码
		password: "123456",
		// 所连接的数据库名称
		database: "in37"
	})
	//开始连接数据库
	Myconnect.connect(function(err) {
		if (err) {
			console.log(`myqsl连接失败:${err}!`)
		} else {
			console.log('恭喜哦，mysql连接成功哦')
		}
	})

	//因为query查询是一个异步操作，所以用promise来操作
	return new Promise((resolve, reject) => {
		//query() 函数用于mysql语句查询
		Myconnect.query(sql, (err, result) => {
			if (err) {
				reject(err)
			} else {
				let res = JSON.parse(JSON.stringify(result))
				resolve(res)
				closeMysql(Myconnect) //调用函数关闭mysql连接
			}
		});
	})
}

//关闭mysql数据库的函数
function closeMysql(Myconnect) {
	Myconnect.end((err) => {
		if (err) {
			console.log(`mysql关闭失败:${err}!`)
		} else {
			console.log('mysql关闭成功')
		}
	})
}

//导出conMysql函数
exports.conMysql = conMysql