const app = getApp();
const dataUrl = app.globalData.url;
const picUrl = app.globalData.imgUrl;
const network = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },
  nextTo() {
    wx.navigateTo({
      url: '/pages/enterpriseStatus/enterpriseStatus',
    })
  },
  copyTap(e) {
    console.log("e", e)
    let [indexId, list] = [e.currentTarget.dataset.id, this.data.list]
    for (let i = 0, len = list.length; i < len; i++) {
      if (indexId == i) {
        wx.setClipboardData({
          data: list[i].order_sn,
          success: function (res) {
            wx.getClipboardData({
              success: function (res) {
                console.log("res", res)
              },
              fail: res => {
                console.log("fail", res)
              }
            })
          }
        })
        break
      }
    }
    // console.log("list", list)
    // setTimeout(() => {
    //   this.setData({
    //     list: list
    //   })
    // }, 1000)
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
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Member/companyOrder"]
    let data = {
      // token: token,
      token: 1,
      // app_id: "wxde059b418de529cd"
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("resData", data)
        console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          that.setData({
            list: resData
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },


})