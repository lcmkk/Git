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

// 4.路由（配置学生管理路由模块）
var stuRouter = require('./routes/stu');
app.use('/stu', stuRouter);

//5.启动服务
app.listen(8080, () => {
  console.log('服务启动成功，访问：http://localhost:8080/stu')
})