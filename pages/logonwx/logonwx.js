// pages/logon/logon.js
const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const iconUrl = app.globalData.iconUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: picUrl,
    iconUrl: iconUrl,
    disabled: ""
  },

  bindGetUserInfo: function (e) { //登陆注册
    console.log("e", e)
    if (!e.detail.userInfo) {
      return
    }
    let [that, userInfo] = [this, e.detail.userInfo]
    that.setData({
      disabled: true
    })
    let [nickName, avatarUrl, gender, sceneId] = [userInfo.nickName, userInfo.avatarUrl, userInfo.gender, wx.getStorageSync("sceneId")];
    let url = dataUrl + "/Api/Login/login"
    let data = {
      code: wx.getStorageSync("code"),
      nickName: nickName,
      avatarUrl: avatarUrl,
      gender: gender,
      scene_id: sceneId
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("resdata", data)
        console.log("res", res)
        if (res.data.code == 0) {
          var resData = res.data.data
          wx.setStorageSync("uid", resData.uid)
          wx.setStorageSync("isVip", resData.is_vip)
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
        that.setData({
          disabled: ""
        })
      },
      fail: res => {
        // debugger
        console.log("fail", res)
        that.setData({
          disabled: ""
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getPhoneNumber: function (e) {

    console.log(e.detail.iv);
    console.log(e.detail.encryptedData);
    let url = dataUrl + '/Api/Member/setPhone'
    let data = {
      'encryptedData': encodeURIComponent(e.detail.encryptedData),
      'iv': e.detail.iv,
    }

    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", res)
      },
      fail: res => {
        // debugger
        console.log("fail", res)

      }
    })

  }
})