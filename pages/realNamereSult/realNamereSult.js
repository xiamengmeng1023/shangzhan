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
    info: {},
    status: "",
    backBtn: "",
    imageUrl: "",
    isRealName: false,
  },

  back: function () {
    let status = Math.floor(this.data.info.status)
    console.log("status", status)
    if (status == 2) {
      wx.navigateTo({
        url: '/pages/realNameAuthentication/realNameAuthentication',
      })
    } else if (status == 3) {
      wx.navigateTo({
        url: '/pages/setting/setting',
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let [that, url, token] = [this, dataUrl + "/Api/Member/idCard", wx.getStorageSync('uid')]
    let data1 = {
      token: token,
      type: 1
    }
    network.POST({
      params: data1,
      url: url,
      success: res => {
        if (res.data.code == 0) {
          let resData = res.data.data
          switch (Number(resData.status)) {
            case 0:
              that.setData({
                status: "审核中",
                backBtn: "好的",
                imageUrl: "btn/shenhe_ing.png",
                isRealName: false
              })
              break;
            case 1:
              that.setData({
                status: "认证成功",
                backBtn: "返回",
                imageUrl: "btn/shenhe_ok.png",
                isRealName: true
              })
              break;
            case 2:
              that.setData({
                status: "认证失败",
                backBtn: "重新绑定",
                imageUrl: "btn/shenhe_no.png",
                isRealName: false
              })
              break;
            case 3:
              that.setData({
                status: "审核中",
                backBtn: "好的",
                imageUrl: "btn/shenhe_ing.png",
                isRealName: false
              })
              break;
          }
          that.setData({
            info: resData
          })
        }
      },
      fail: res => {
        console.log(res.data)
      }
    })
  },


})