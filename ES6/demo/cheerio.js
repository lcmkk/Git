//1.引入http和cheerio模块
var http = require('http')
var https = require('https')
var cheerio = require('cheerio')
//2.发送get请求
function fetchHttpData(url) {
  http.get(url, function (req, res) {
    //2.1接受数据
    var html = '';
    //data事件，用来接收数据
    req.on('data', function (data) {
      html += data; //分片传输 所以拼接
    });
    //2.2数据接受完毕
    req.on('end', function () {
      //console.log(html)  //该html就是刚刚那个网站的所有数据
      //过滤数据
      getNeedData(html);
    });
  })
}

function fetchHttpsData(url) {
  https.get(url, function (req, res) {
    //2.1接受数据
    var html = '';
    //data事件，用来接收数据
    req.on('data', function (data) {
      html += data; //分片传输 所以拼接
    });
    //2.2数据接受完毕
    req.on('end', function () {
      //console.log(html)  //该html就是刚刚那个网站的所有数据
      //过滤数据
      getNeedData(html);
    });
  })
}

function getNeedData(htmlData) {
  // 通过decodeEntities解决乱码
  var $ = cheerio.load(htmlData, {
    decodeEntities: false
  })

  // // 获取a标签中的 内容  a标签 class=xst
  // $('.xst').each(function (index, item) {
  //   console.log($(item).html())
  // })
  $('.api_nav_cn_name').each(function (index, item) {
    console.log($(item).html())
  })
}

// fetchHttpData('http://bbs.itheima.com/forum-401-1.html')
fetchHttpData('http://nodejs.cn/api/https.html')
// fetchHttpsData('https://www.bilibili.com/video/BV19t411Q768?p=78&spm_id_from=pageDriver.html')