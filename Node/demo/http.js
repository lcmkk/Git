//1.引入模块
var http = require('http')
//2.创建web服务器
var server = http.createServer()
//3.监听请求
server.on('request', function(req, res) {  //req - request 请求  res - response 响应
	// console.log(req)
	// console.log(req.headers);     	//获取请求头信息（对象）
	// console.log(req.rawHeaders); 	//获取请求头信息（数组）
	// console.log(req.httpVersion); 	//获取HTTP版本
	// console.log(req.method);		//获取请求方法
	// console.log(req.url);         	//获取请求路径（注：不含网址）

	//留心：有请求就必须有响应，没有响应网页无法打开
	// res.statusCode = 404;
	// res.statusMessage = 'Not Found';
	// res.setHeader('Content-Type', 'text/html;charset=utf-8');
	res.writeHeader(404, 'Not Found2', {
		'Content-Type' : 'text/html; charset=utf8'
	})
	// res.write("哥哥来抓我呀，<a href='http://nn.com'>点击进入我的世界</a>");
	res.write('打印request对象');
	res.end();
})
//4.启动服务，监听8080端口
server.listen(8080, function(){
	console.log('服务启动成功，访问：http://localhost:8080')
})