const { urlencoded } = require('express');
var express = require('express');
var router = express.Router();
var modules = require("../models");

/* GET users listing. */
router.get('/addUser', async function(req, res, next) {
	console.log(req.query)
	let js_code = req.query.code
	let appid = 'wx38ca0a6e1887e1b0'
	let secret = 'd531fdeab105bfe3ce593bd12aed9903'
	let grant_type = 'authorization_code'
	const options = {
		hostname: 'https://api.weixin.qq.com',
		path: `/sns/jscode2session?appid=${appid}&secret=${secret}&grant_type=${grant_type}&js_code=${js_code}`,
		method: 'get'
	};
	var request = require('request');
	request(options.hostname + options.path, async function(error, response, body) {
		if (!error && response.statusCode == 200) {
			let res1 = JSON.parse(body)
			let openId = res1.openid
			if (res1.openid) {
				let user = await modules.User.findAll({
					where: {
						openId
					}
				})
				if (user.length <= 0) {
					let user1 = await modules.User.create({
						openId
					})
					res.json({
						status: "SUCCESS",
						code: '200',
						data: {
							userId: user1[0].id,
							openId: user1[0].openId
						}
					})
				} else {
					res.json({
						status: "SUCCESS",
						code: '200',
						data: {
							userId: user[0].id,
							openId: user[0].openId
						}
					})
				}
			}
		}
	})
	// let a = await modules.User.findAll({
	// 	where: {

	// 	}
	// })
	//    res.json({
	// 	data: a
	// })
});


router.post('/getResoult', async function(req, res){
	let url = encodeURI(req.body.url)
	var request = require('request');
	request('https://gongju.yyymvp.com/query?url='+url, async function(error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body))
			await modules.Search.create({
				userId: req.body.userId,
				seachValue: req.body.url,
				title: JSON.parse(body).data.title,
				imgs: JSON.stringify(JSON.parse(body).data.pics),
				status: 1
			})
		} else {
			await modules.Search.create({
				userId: req.body.userId,
				seachValue: req.body.url,
				title: '查询失败',
				imgs: '',
				status: 0
			})
			res.json(JSON.parse(body))
		}
	})
})

module.exports = router;