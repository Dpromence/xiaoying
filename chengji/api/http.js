//引入模块
const express = require('express');
const app = express();
const url = require('url')
const {conMysql} = require('./db.js');
const bodyParser = require('body-parser');
const request = require('request');
const sd = require('silly-datetime');

const urlencodedParser = bodyParser.urlencoded({ extended: false })
//导入我们上一步写的连接数据库的函数

const cors = require('cors')
app.use(cors())




// 导入学生信息
app.get('/student/getOne', (req,res)=>{
	let data = JSON.parse(req.query.data)
	let string = []
	for (let i in data) {
		string.push(`('${data[i].id}','${data[i].name}','${data[i].idCard}')`)
	}
	let sql = `INSERT INTO student(studentId, studentName, idCard) VALUES ${string};`
	conMysql(sql).then(result => {
		res.send(result)
		conMysql.end()
	})
})
// 登陆
app.post('/login',urlencodedParser, (req, res)=>{
	let js_code = req.body.code
	console.log(req.body)
	let appid = 'wx38ca0a6e1887e1b0'
	let secret = 'd531fdeab105bfe3ce593bd12aed9903'
	let grant_type = 'authorization_code'
	const options = {
	  hostname: 'https://api.weixin.qq.com',
	  path: `/sns/jscode2session?appid=${appid}&secret=${secret}&grant_type=${grant_type}&js_code=${js_code}`,
	  method: 'get'
	};
	var request = require('request');
	request(options.hostname+options.path, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body) // 请求成功的处理逻辑，注意body是json字符串
		let res1 = JSON.parse(body)
		 const time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
		 console.log(time);
		let sql = `INSERT INTO user(openId, creatTime) VALUES ('${res1.openid}', '${time}')`
		conMysql(sql).then(result => {
			res.send({
				code: 200,
				msg: 'success',
				data: {
					openId
				}
			})
		}).catch(res2 => {
			 console.log(res2)
			res.send({
				code: 100,
				msg: res2.code
			})
		})
	  }
	});
	// 
})
// 存用户输入的数据
app.post('/saveValue',urlencodedParser, (req, res)=>{
	let url = req.body.url
	const options = {
	  hostname: `https://gongju.yyymvp.com/query?url=${url}`,
	  method: 'get'
	};
	var request = require('request');
	request(options.hostname, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body) // 请求成功的处理逻辑，注意body是json字符串
		let res1 = JSON.parse(body)
		 const time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
		 console.log(time);
		let sql = `INSERT INTO search(openId, creatTime) VALUES ('${res1.openid}', '${time}')`
		conMysql(sql).then(result => {
			res.send({
				code: 200,
				msg: 'success',
				data: result
			})
		}).catch(res2 => {
			 console.log(res2)
			res.send({
				code: 100,
				msg: res2.code
			})
		})
	  }
	});
})

// 获取学生分数
app.post('/student/getStudentScore',urlencodedParser, (req, res)=>{
	let studentId = req.body.studentId
	console.log(req.body.studentId)
	let sql = `select a.studentName,a.idCard,a.studentId, b.score, b.rank, c.subjectName, d.examName, d.examId
	from student a
	left join score b on a.studentId=b.studentId
	left join subject c on b.subjectId=c.subjectId
	left join exam d on b.examId = d.examId  WHERE   a.studentId =${studentId} GROUP BY b.examId`
	conMysql(sql).then(result => {
		console.log(result)
		let map = {};
		let dest = [];
		result.forEach(item => {
			console.log(item)
			// if(!map[item[examId]]) {
			// 	console.log(item[examId])
			// 	dest.push({
			// 		[examId]: item[examId],
			// 		list: [item]
			// 	});
			// 	map[item[examId]] = item;
			// } else {
			// 	dest.forEach(dItem => {
			// 		console.log(dItem)
			// 		if (dItem[examId] == item[examId]) {
			// 			dItem.list.push(item);
			// 		}
			// 	});
			// }
		})
		console.log(dest)
		res.send({
			code: 200,
			msg: 'success',
			data: result
		})
	}).catch(res1 => {
		res.send({
			code: 100,
			msg: res1.code
		})
	})
})


// 设置端口
app.listen(8888, function() {
	console.log('正在启动8888....');
})


