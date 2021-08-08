var express = require('express')
var fs = require('fs')
var md5 = require('md5')
var router = express.Router()

var dbPath = './db.json'
//导入数据模型
var StuModel = require('../models/stu')
//登录-视图
router.get('/login', (req, res) => {
  //加载视图
  res.render('login.html')
})
//注册-视图
router.get('/register', (req, res) => {
  //加载视图
  res.render('register.html')
})
// 登录-数据处理
router.post('/login', (req, res) => {
  // 1.获取数据
  var loginData = req.body
  console.log(loginData)
  // 2.操作数据库
  // 2.1获取所有数据(同步读取文件)
  var stus = fs.readFileSync(dbPath)
  stus = JSON.parse(stus.toString()).stus
  // 2.2查找当前用户数据在数据库是否存在
  var stu = stus.find(item => item.name == loginData.uname)
  // 2.3根据结果响应
  if (!stu) {
    return res.status(200).json({
      status: 1,
      message: '用户不存在'
    })
  }
  if (stu.pwd != md5(loginData.pwd)) {
    return res.status(200).json({
      status: 1,
      message: '密码错误'
    })
  }
  return res.status(200).json({
    status: 0,
    message: '登录成功'
  })
})
// 注册-数据处理
router.post('/register', (req, res) => {
  // 1.获取数据
  var loginData = req.body
  console.log(loginData)
  // 2.操作数据库
  // 2.1获取所有数据(同步读取文件)
  var stus = fs.readFileSync(dbPath)
  stus = JSON.parse(stus.toString()).stus
  // 2.2查找当前用户数据在数据库是否存在
  var stu = stus.find(item => item.name == loginData.uname)
  // 2.3根据结果响应
  if (stu) {
    return res.status(200).json({
      status: 1,
      message: '用户已存在'
    })
  }
  // 数据处理
  var d = new Date()
  var dateStr = `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}-${d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate()}`
  loginData.create_at = dateStr
  loginData.update_at = dateStr
  loginData.id = stus.length ? stus[stus.length - 1].id + 1 : 1
  loginData.pwd = md5(loginData.pwd)
  stus.push(loginData)

  //2.4.入库（把字符串保存到文件中）
  var stusStr = JSON.stringify({
    stus: stus
  })
  fs.writeFile('./db.json', stusStr, function (err) {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: '文件写入失败'
      })
    }
    //注册成功
    return res.status(200).json({
      status: 0,
      message: '注册成功'
    })
  })

})

module.exports = router