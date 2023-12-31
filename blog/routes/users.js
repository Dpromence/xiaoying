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
			if (JSON.parse(body).code != 100) {
				await modules.Search.create({
					userId: req.body.userId,
					seachValue: req.body.url,
					title: '查询失败',
					imgs: '',
					status: 0
				})
				res.json(JSON.parse(body))
			} else {
				try {
					if (JSON.parse(body).data.type == 2) {
						let data = await modules.Upload.findAll({
							where: {
								title: JSON.parse(body).data.title,
								status: 2
							}
						})
						let array = [...JSON.parse(data[0].dataValues.imgs), ...JSON.parse(body).data.pics]
						let data1 = JSON.parse(body)
						data1.data.pics = array
						await modules.Search.create({
							userId: req.body.userId,
							seachValue: req.body.url,
							title: JSON.parse(body).data.title,
							imgs: JSON.stringify(array),
							status: 1
						})
						res.json(data1)
					}
				} catch (error) {
					res.json(JSON.parse(body))
				}
			}
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
		res.json({
			status: "fail",
			code: '100',
			data: ''
		})
		
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


const multer = require('multer')
//磁盘存储引擎，可以控制文件的存储，省略的话这些文件会保存在内存中，不会写入磁盘
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //控制文件的存储路径
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        //定义上传文件存储时的文件名
        cb(null, "image_" + Date.now() +'_' + file.originalname)
    }
})
const upload = multer({ storage: storage })

router.post('/upload', upload.single('imageFile'), async function(req, res) {
	// 导入模型文件（根据自己项目中的情况修改
    const imgUrl = `http://127.0.0.1:3000/images/${req.file.filename}`
	try {
		await modules.Imgs.create({
			openId: req.body.openId,
			img: imgUrl
		})
		res.json({
			status: "SUCCESS",
			code: '200',
			data: {
				url: imgUrl
			}
		})
	} catch (error) {
		res.json({
			status: "fail",
			code: '100',
			data: ''
		})
	}
	
})

router.post('/write', async function(req, res) {
	// 导入模型文件（根据自己项目中的情况修改
	console.log(req.body.userId)
	try {
		await modules.Upload.create({
			userId: req.body.userId,
			seachValue: '',
			title: req.body.title,
			imgs: req.body.detailsImages,
			status: 2
		})
		res.json({
			status: "SUCCESS",
			code: '200',
			data: ''
		})
	} catch (error) {
		res.json({
			status: "fail",
			code: '100',
			data: ''
		})
	}
	
})
router.post('/getWrite', async function(req, res) {
	// 导入模型文件（根据自己项目中的情况修改
	console.log(req.body.no)
	try {
		const result = await modules.Search.findAll({
			where: {
				status: 1,
				id: req.body.no
			}
		});
		res.json({
			status: "SUCCESS",
			code: '200',
			data: result
		})
	} catch (error) {
		res.json({
			status: "fail",
			code: '100',
			data: ''
		})
	}
	
})

module.exports = router;