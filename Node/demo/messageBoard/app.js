// 引入Http模块
var http = require('http')
// 引入fs模块用于读写文件
var fs = require('fs')
// 引入url服务
var url = require('url')
var querystring = require('querystring')
// 创建Web服务器
var server = http.createServer()

// 临时数据
var msgs = [{
  name: '张三',
  content: '今天天气真好',
  createTime: '2021-7-31 17:05:36'
}, {
  name: '李四',
  content: '张三来到海南岛',
  createTime: '2021-7-31 17:20:36'
}, {
  name: '王五',
  content: '看见李四在洗澡',
  createTime: '2021-7-31 17:29:36'
}]
// 监听请求
server.on('request', (req, res) => {
  // 获取当前url
  var curUrl = req.url
  // 请求'/'根路径，加载留言板列表
  if (curUrl == '/' || curUrl == '/index') {
    fs.readFile('./view/index.html', 'utf8', (err, data) => {
      if (err) {
        res.end('404 Not Found')
      } else {
        var html = ''
        res.setHeader('Content-Type', 'text/html;charset=utf-8')
        msgs.forEach(item => {
          html += `<li class="list-group-item">${item.name}说：${item.content} <span class="pull-right">${item.createTime}</span></li>` 
        })
        var data = data.replace('666', html)
        res.write(data)
        res.end()
      }
    })
  } else if (curUrl == '/add') {
    // 请求'/add'添加留言路径，加载添加留言
    fs.readFile('./view/add.html', 'utf8', (err, data) => {
      if (err) {
        res.end('404 Not Found')
      } else {
        res.setHeader('Content-Type', 'text/html;charset=utf-8')
        res.write(data)
        res.end()
      }
    })
  } else if (curUrl.indexOf('/doadd') === 0) {
    // 表单提交，先判断请求方式是get还是post
    if (req.method == 'GET') {
      // 接收数据
      var paramObj = url.parse(req.url, true).query
      console.log(paramObj)
      // 处理数据
      var date = new Date()
      var dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      var msg = {
        ...paramObj,
        createTime: dateFormat
      }
      msgs.push(msg)
      // 跳转首页列表页
      // 301:永久重定向，302:临时重定向
      res.statusCode = 302
      res.setHeader('Location', '/')
      res.end()
    } else {
      // POST提交方式
      var postData = ''
      // 数据传输中
      req.on('data', chunk => {
        postData += chunk
      })
      // 数据传输完成
      req.on('end', () => {
        // 接收数据
        var paramObj = querystring.parse(postData); 
        console.log(paramObj)
        // 处理数据
        var date = new Date()
        var dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        var msg = {
          ...paramObj,
          createTime: dateFormat
        }
        msgs.push(msg)
        // 跳转首页列表页
        // 301:永久重定向，302:临时重定向
        res.statusCode = 302
        res.setHeader('Location', '/')
        res.end()
      })
    }
  } else if (curUrl.indexOf('/public') === 0) {
    // 请求静态资源public目录下的资源
    fs.readFile('./' + curUrl, 'utf8', (err, data) => {
      if (err) {
        res.end('404 Not Found')
      } else {
        res.write(data)
        res.end()
      }
    })
  } else {
    // 找不到资源，返回404页面
    fs.readFile('./view/404.html', 'utf8', (err, data) => {
      if (err) {
        res.end('404 Not Found')
      } else {
        res.setHeader('Content-Type', 'text/html;charset=utf-8')
        res.write(data)
        res.end()
      }
    })
  }
})
// 启动服务，监听端口
server.listen(8080, () => {
  console.log('启动成功，访问http://localhost:8080')
})