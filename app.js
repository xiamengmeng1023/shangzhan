//app.js
App({

  onLaunch: function () {
    // 展示本地存储能力
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.setStorageSync("code", res.code)
      }
    })

    wx.request({
      url: that.globalData.url + '/Api/Home/share',
      data: {
        // app_id: "wxde059b418de529cd"
        app_id: "wx5550cef350778b61"
      },
      success: res => {
        that.globalData.shareText = res.data.data.content
      }
    })
    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight
        // console.log(this.globalData.titleBarHeight)
        // console.log(res.statusBarHeight)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  isNull() {
    let token = wx.getStorageSync("uid")
    if (!token) {
      wx.redirectTo({
        url: '/pages/logonwx/logonwx',
      })
      return false
    } else {
      return true
    }
  },
  globalData: {
    userInfo: null,
    url: 'https://www.shangzhanyun.com',
    imgUrl: "https://www.shangzhanyun.com/Public",
    iconUrl: 'https://www.shangzhanyun.com/Public/Style/images/applets/new_version/',
    shareText: '',
    webim: '',
    navHeight: 0,
    titleBarHeight: 0,
  }
})