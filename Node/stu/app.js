//1.引入express框架模块
var express = require('express')
var fs = require('fs')
//2.创建框架核心app对象
var app = express()
//3.配置框架
//3.1配置静态资源目录/public对外可访问
app.use('/public', express.static('public'))
//3.2配置node_modules目录对外可访问
app.use('/node_modules', express.static('node_modules'))
//3.3配置html文件使用art-template模板引擎
app.engine('html', require('express-art-template'))
//4.路由
app.get('/stu', function(req, res){
	//学生列表
	return res.render('index.html')
})
//5.启动服务
app.listen(8080, function(){
	console.log('服务启动成功，访问：http://localhost:8080')
})
