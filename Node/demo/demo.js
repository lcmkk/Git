// 引入内置模块
var os = require('os')    // 操作系统模块
var url = require('url')  // URL模块
var fs = require('fs')    // 读写文件模块

console.log('主机：' + os.hostname())
console.log('总内存：' + (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + 'G')
console.log('可用内存：' + (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + 'G')
// console.dir(os.networkInterfaces())
// console.log(JSON.stringify(os.networkInterfaces()))      // 分配的网络地址信息

var reqUrl = 'http://www.baidu.com/find?name=张三&age=18'

// console.log(url.parse(reqUrl, true))
console.log(url.parse(reqUrl, true).query)          // 获取参数信息，并转换成对象
console.log(url.parse(reqUrl, true).query.name)

// 写文件
fs.writeFile('a.txt', 'hello nodejs', err => {
  if (err) {
    console.log('写入文件报错：' + err)
    return
  }
  console.log('写入文件成功')
})

// 读文件
fs.readFile('a.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('读取文件报错：' + err)
    return
  }
  console.log(data)
})