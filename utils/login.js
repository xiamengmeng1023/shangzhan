module.exports = {
  getCode: getCode
}

function getCode() {
  var code
  // 登录
  wx.login({
    success: res => {
      console.log('res', res)
      code = res.code
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
    }
  })
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        wx.getUserInfo({
          success: function (res) {
            // console(res.userInfo)
          }
        })
      } else {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log('基本信息', res)
              var nickname = res.userInfo.nickName
              wx.setStorageSync('nickname', res.userInfo.nickName)
              // var name = ''
              // var sex = res.userInfo.gender
              // var age = ''
              var avatar = res.userInfo.avatarUrl
              wx.setStorageSync('avatar', res.userInfo.avatarUrl)

              wx.request({
                url: 'https://apis.volin.cn/apis/indexs/getWxCode',
                data: {
                  code: code
                },
                method: "POST",
                header: {
                  "Content-Type": "application/json"
                },
                success: function (res) {
                  console.log('11111', res)
                  wx.setStorageSync('uid', res.data.responseData.openid)
                  console.log('uid', res.data.responseData.openid)
                },
              })
              console.log('5555555', res)
              // 可以将 res 发送给后台解码出 unionId
              // this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        }
      }
    }
  })
}