/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
*/

var app = new Vue({
  el: '#player',
  data: {
    query: '',
    musicList: [],
    isPlaying: false,
    musicCover: '',
    hotComments: [],
    musicUrl: '',
    isShow: false,
    mvUrl: '',
  },
  methods: {
    // 搜索歌曲
    searchMusic(query) {
      var that = this;
      axios.get(`https://autumnfish.cn/search?keywords=${query}`).then(res => {
        that.musicList = res.data.result.songs
      }).catch(err => {
        console.log(err)
      })
    },
    // 播放选中歌曲
    playMusic(id) {
      var that = this;
      // 获取歌曲
      axios.get(`https://autumnfish.cn/song/url?id=${id}`).then(res => {
        that.musicUrl = res.data.data[0].url
      }).catch(err => {
        console.log(err)
      })
      // 获取歌曲详情
      axios.get(`https://autumnfish.cn/song/detail?ids=${id}`).then(res => {
        that.isPlaying = true
        that.musicCover = res.data.songs[0].al.picUrl
      }).catch(err => {
        console.log(err)
      })
      // 获取歌曲评论
      axios.get(`https://autumnfish.cn/comment/hot?type=0&id=${id}`).then(res => {
        that.hotComments = res.data.hotComments
      }).catch(err => {
        console.log(err)
      })
    },
    // 继续播放当前歌曲
    play() {
      this.isPlaying = true
    },
    // 暂停
    pause() {
      this.isPlaying = false
    },
    // 播放mv
    playMV(id) {
      var that = this;
      axios.get(`https://autumnfish.cn/mv/url?id=${id}`).then(res => {
        that.isShow = true;
        that.mvUrl = res.data.data.url;
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击遮罩层隐藏mv界面
    hide() {
      document.querySelector('#mv').pause()
      this.isShow = false
    }
  },
  created() {
    this.searchMusic('QQ飞车')
  }
})