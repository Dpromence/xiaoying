const {
	urlencoded
} = require('express');

const {
	Op
} = require('sequelize');
var express = require('express');
var router = express.Router();
var modules = require("../models");
var https = require("https");

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
});


router.post('/getResoult', async function(req, res) {
	let url = encodeURI(req.body.url)
	const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
	const strValue = url.match(reg);
	let result = ''
	if (strValue && strValue.length > 0) {
		result = strValue[0];
	}
	var request = require('request');
	request('https://uu.yyymvp.com/query?url=' + result, async function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).code)
			if (JSON.parse(body).code != 100) {
				await modules.Search.create({
					userId: req.body.userId,
					seachValue: req.body.url,
					title: '查询失败',
					imgs: '',
					status: 0
				})
			} else {
				try {
					await modules.Search.create({
						userId: req.body.userId,
						seachValue: req.body.url,
						title: JSON.parse(body).data.title,
						imgs: JSON.stringify(JSON.parse(body).data.pics),
						status: 1
					})
				} catch (error) {}
				for (let i in JSON.parse(body).data.pics) {
					try {
						const fs = require('fs')
						const path = require('path')
						const imageUrl = JSON.parse(body).data.pics[i]
						const imageFormat = path.extname(imageUrl).toLowerCase().split('?')[0];
						
						
						// let imgs = 'https://ci.xiaohongshu.com/1040g2sg30rrr9kjm2o005ndbqreg8oqgpea53s8?imageView2/2/w/0/format/jpg/v3'
						// let imgs = 'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/og7ArANh5gs3y4iNlICmetAGAaEBfxAAzMB38m~tplv-dy-lqen-new:930:1653:q80.jpeg?x-expires=1705226400&x-signature=dU8%2F4jCqBe%2Fajjxp7iC4tzgRyU8%3D&from=3213915784&s=PackSourceEnum_DOUYIN_REFLOW&se=false&sc=image&biz_tag=aweme_images&l=20231215182126DC64E65F5C4842068754'
						https.get(imageUrl, res => {
						   console.log(res.headers)
						   console.log(res.headers['content-type'].split('/')[1])
						   const filename = "image_" + Date.now() + '.' + res.headers['content-type'].split('/')[1]
						   const filePath = path.join(__dirname, 'uploads/imgs/', filename)
						   request(imageUrl).on('error', async function(err) {
						   	console.log("Error downloading the image: " + err);
						   }).pipe(fs.createWriteStream(filePath)).on('finish',async function() {
						   	await modules.Imgs.create({
						   		openId: req.body.openId,
						   		img: JSON.parse(body).data.pics[i],
						   		imgName: filename
						   	})
						   	console.log("Image downloaded and saved successfully.");
						   });
						}).on('error', err => {
						    console.log('Error: ', err.message);
						});
						
						
						
					// 	console.log(filePath)
					
					} catch (error) {

					}
				}
			}
			res.json(JSON.parse(body))
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


router.get('/getCount', async function(req, res) {
	// 导入模型文件（根据自己项目中的情况修改）
	try {
		const count = await modules.Search.count({
			where: {
				createdAt: {
					[Op.gte]: new Date().setHours(0, 0, 0, 0),
					[Op.lt]: new Date().setHours(23, 59, 59, 999)
				},
			},
		});
		res.json({
			status: "SUCCESS",
			code: '200',
			data: {
				count: count
			}
		})
		console.log(`今天共有 ${count} 条数据。`);
	} catch (error) {
		console.error("发生错误：", error);
	}
})


router.get('/getImgs', async function(req, res) {
	// 导入模型文件（根据自己项目中的情况修改）
	try {
		let page = req.query.page
		let pageSize = req.query.pageSize - 0
		let offset = (page - 1) * pageSize
		const result = await modules.Search.findAndCountAll({
			where: {
				status: 1
			},
			limit: pageSize,
			offset: offset,
			order: [
				["createdAt", "desc"]
			], // 以createdAt字段倒叙
		});
		res.json({
			status: "SUCCESS",
			code: '200',
			data: result.rows,
			count: result.count
		})
	} catch (error) {
		console.error("发生错误：", error);
	}
})


router.get('/history', async function(req, res) {
	// 导入模型文件（根据自己项目中的情况修改）
	try {
		let userId = req.query.userId
		let page = req.query.page
		let pageSize = req.query.pageSize - 0
		let offset = (page - 1) * pageSize
		const result = await modules.Search.findAndCountAll({
			where: {
				status: 1,
				userId: userId
			},
			limit: pageSize,
			offset: offset,
			order: [
				["createdAt", "desc"]
			], // 以createdAt字段倒叙
		});
		res.json({
			status: "SUCCESS",
			code: '200',
			data: result.rows,
			count: result.count
		})
	} catch (error) {
		console.error("发生错误：", error);
	}
})



module.exports = router;