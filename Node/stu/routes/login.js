var express = require('express')
var fs = require('fs')
var md5 = require('md5')
var router = express.Router()
var session = require('express-session')

var dbPath = './db.json'
//导入数据模型
var StuModel = require('../models/stu')


router.use(session({
  secret: 'itcast', //加密存储
  resave: false, //客户端并行请求是否覆盖:true-是,false-否
  saveUninitialized: true //初始化session存储
}))

//检测用户是否登录中间件
router.use(function (req, res, next) {
  //当用户访问的不是注册页也不是登录才进去（判断用户是否有权访问）
  if (req.url != '/register' && req.url != '/login') {
    //当session不存在时则跳转到登录页
    if (!req.session.isLogin)
      res.redirect('/login')
  }
  //没进判断（访问的是登录或注册页） 或者 进了判断又出来了（身份通过）
  next()
})


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
//退出
// 清空session数据，跳转登录页
router.get('/logout', function (req, res) {
  console.log(req.session)
  req.session.isLogin = false
  req.session.userinfo = null
  res.redirect('/login')
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
  var stu = stus.find(item => item.name == loginData.name)
  // 2.3根据结果响应
  if (!stu) {
    return res.status(200).json({
      status: 1,
      message: '用户不存在，若无账号，请先注册'
    })
  }
  if (stu.pwd != md5(loginData.pwd)) {
    return res.status(200).json({
      status: 1,
      message: '密码错误'
    })
  }
  // 登录成功标志
  req.session.isLogin = true
  req.session.userinfo = loginData
  return res.status(200).json({
    status: 0,
    message: '登录成功'
  })
})
// 注册-数据处理
router.post('/register', (req, res) => {
  // 1.获取数据
  var regData = req.body
  // 2.操作数据库
  // 2.1获取所有数据(同步读取文件)
  var stus = fs.readFileSync(dbPath)
  stus = JSON.parse(stus.toString()).stus
  // 2.2查找当前用户数据在数据库是否存在
  var stu = stus.find(item => item.name == regData.name)
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
  regData.create_at = dateStr
  regData.update_at = dateStr
  regData.id = stus.length ? stus[stus.length - 1].id + 1 : 1
  regData.pwd = md5(regData.pwd)
  stus.push(regData)

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