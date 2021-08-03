//1.引入express框架模块
var express = require('express')
var url = require('url')
var moment = require('moment');

//创建留言数据对象
var msgs = [
  {name: '张三', content: "你好我是张三", createTime: '2017-11-14 10:30:32'},
  {name: '李四', content: "你好我是李四", createTime: '2017-11-15 10:11:14'},
  {name: '王五', content: "你好我是王五", createTime: '2017-11-16 10:22:55'}
]


//2.创建框架核心app对象
var app = express()
//3.配置框架(静态文件目录)
app.use('/public', express.static('public'))
app.engine('html', require('express-art-template'))
//4.路由
app.get('/', function(req, res){
//首页
  return res.render('index.html', {
    msgs: msgs
  })
})
app.get('/add', function(req, res){
//添加页
  return res.render('add.html')
})
app.get('/doadd', function(req, res){
  //添加数据处理
  //1.接受参数
  var paramObj = url.parse(req.url, true).query
  //2.入库（压入）
  var date = moment().format("yyyy-MM-d h:mm:ss a");
  var msg = {
    name:paramObj.name,
    content: paramObj.content,
    createTime: date
  }
  msgs.push(msg)
  //3.跳转
  res.redirect('/')

})
//5.启动服务
app.listen(8080, function(){
	console.log('服务启动成功，访问http://localhost:8080')
})
