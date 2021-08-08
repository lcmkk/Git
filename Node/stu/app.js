//1.引入express框架模块
var express = require('express')
var fs = require('fs')
var bodyParser = require('body-parser') //解析POST请求数据
//2.创建框架核心app对象
var app = express()
//3.配置框架
//3.1配置静态资源目录/public对外可访问
app.use('/public', express.static('public'))
//3.2配置node_modules目录对外可访问
app.use('/node_modules', express.static('node_modules'))
//3.3配置html文件使用art-template模板引擎
app.engine('html', require('express-art-template'))
// 3.4配置解析POST请求提交的JSON格式数据
app.use(bodyParser.json()); //解析后放到req对象的body属性中
app.use(bodyParser.urlencoded({
  extended: false
}));

//4.路由
app.get('/stu', (req, res) => {
  //学生列表
  // 4.1从文件中获取数据
  fs.readFile('./db.json', 'utf8', (err, data) => {
    //找不到文件资源，响应404
    if (err) {
      res.end('文件资源db.json不存在')
    } else {
      // 处理数据，字符串=>JSON对象
      var stus = JSON.parse(data).stus
      // 加载视图并传递数据
      res.render('index.html', {
        stus: stus
      })
    }
  })
})
app.get('/stu/create', (req, res) => {
  // 学生添加-视图
  return res.render('post.html')
})
app.get('/stu/edit/:id', (req, res) => {
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
      stu: stu
    })
  })
})
app.get('/stu/delete/:id', (req, res) => {
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

app.post('/stu/create', (req, res) => {
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

app.post('/stu/edit', (req, res) => {
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
      // 3.5跳转到列表页
      res.redirect('/stu')
    })
  })
})

//5.启动服务
app.listen(8080, () => {
  console.log('服务启动成功，访问：http://localhost:8080/stu')
})