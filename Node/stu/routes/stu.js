//4.路由
var express = require('express')
var fs = require('fs')
var router = express.Router()
var md5 = require('md5')

//导入数据模型
var StuModel = require('../models/stu')

router.get('/', (req, res) => {
  //学生列表
  //调用学生模型-find方法
  StuModel.find(function (err, stus) {
    //1.判断错误
    if (err) return res.status(500).send('Server error.')
    //2.加载视图并传递数据
    return res.render('index.html', {
      stus: stus,
      userinfo: req.session.userinfo
    })
  })

})
router.get('/create', (req, res) => {
  // 学生添加-视图
  return res.render('post.html', {
    userinfo: req.session.userinfo
  })
})
router.get('/edit/:id', (req, res) => {
  // 学生修改-视图
  // 获取url中的参数id
  var id = req.params.id
  // 获取文件中对应id的数据
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) res.send('服务端出错，，找不到文件资源db.json')
    var stus = JSON.parse(data.toString()).stus
    // 根据指定id查找指定学生信息
    var stu = stus.find(item => item.id == id)
    // 加载视图并传递数据
    return res.render('edit.html', {
      stu: stu,
      userinfo: req.session.userinfo
    })
  })
})
router.get('/delete/:id', (req, res) => {
  // 学生修改-视图
  // 1.获取url中的参数id
  var id = req.params.id
  // 2.获取旧数据
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) res.send('服务端出错，，找不到文件资源db.json')
    var stus = JSON.parse(data.toString()).stus
    // 根据指定id查找指定学生信息
    var deleteId = stus.findIndex(item => item.id == id)
    // 3.处理数据
    stus.splice(deleteId, 1)
    // 4.写入到数据库文件（PS：需要转换成字符串再写入）
    var stusStr = JSON.stringify({
      stus: stus
    })
    fs.writeFile('./db.json', stusStr, err => {
      if (err) res.send('服务端出错，写入文件失败')
      // 5.跳转到列表页
      // 3.5跳转到列表页
      res.redirect('/stu')
    })
  })
})

router.post('/create', (req, res) => {
  //学生添加页-数据处理
  // 1、接收表单数据
  var stu = req.body
  // 2、数据过滤（筛选数据，此处不需要此操作跳过）

  // 3、更新数据库数据（PS：因为此例子是操作文件，所以需要判重等操作）
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) res.send('服务端出错，找不到文件资源db.json')
    // 3.1获取旧数据
    var stus = JSON.parse(data).stus
    // 3.2数据处理
    var d = new Date()
    var dateStr = `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}-${d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate()}`
    stu.create_at = dateStr
    stu.update_at = dateStr
    stu.id = stus.length ? stus[stus.length - 1].id + 1 : 1
    stu.pwd = md5(stu.pwd)
    // 3.3添加到数据库
    stus.push(stu)
    // 3.4写入到数据库文件（PS：需要转换成字符串再写入）
    var stusStr = JSON.stringify({
      stus: stus
    })
    fs.writeFile('./db.json', stusStr, err => {
      if (err) res.send('服务端出错，写入文件失败')
      // 3.5跳转到列表页
      res.redirect('/stu')
    })
  })
})

router.post('/edit', (req, res) => {
  //学生添加页-数据处理
  // 1、接收表单数据(PS：注意此时隐式传递了参数id)
  var stu = req.body
  // 2、数据过滤（筛选数据，此处不需要此操作跳过）

  // 3、更新数据库数据（PS：因为此例子是操作文件，所以需要判重等操作）
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) res.send('服务端出错，找不到文件资源db.json')
    // 3.1获取旧数据
    var stus = JSON.parse(data.toString()).stus
    // 3.2数据处理
    var d = new Date()
    var dateStr = `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}-${d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate()}`
    stu.update_at = dateStr
    // 获取id对应的学生信息的下标
    var updateId = stus.findIndex(item => item.id == stu.id)
    stu.id = parseInt(stu.id)
    // 3.3添加到数据库
    stus[updateId] = stu
    // 3.4写入到数据库文件（PS：需要转换成字符串再写入）
    var stusStr = JSON.stringify({
      stus: stus
    })
    fs.writeFile('./db.json', stusStr, err => {
      if (err) res.send('服务端出错，写入文件失败')
      // 3.5跳转到列表页,session不能丢
      res.redirect('/stu')
    })
  })
})

// 导出模块
module.exports = router