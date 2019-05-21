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
    order_detail: [],
    hasOrder: false,
    tempTxt: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options);
    let that = this
    let token = wx.getStorageSync("uid")
    let getOrderDetailUrl = dataUrl + "/Api/Member/order_detail"
    let data = {
      // 假数据
      token: token,
      // token: 1642,
      // app_id: 'wxde059b418de529cd',
      order_sn: options.orderSn
    }
    network.POST({
      params: data,
      url: getOrderDetailUrl,
      success: res => {
        // console.log("动态", res.data);
        if (res.data.code === 0) {
          let resData = res.data.data
          console.log('resData', resData);
          that.setData({
            hasOrder: true,
            order_detail: resData,
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 点击复制
  textPaste() {
    // wx.showToast({
    //   title: '复制成功',
    // })
    this.setData({
      tempTxt: this.data.order_detail.order_sn
    })
    wx.setClipboardData({
      data: this.data.tempTxt,
      success: function (res) {
        wx.getClipboardData({
          // 这个api是把拿到的数据放到电脑系统中的
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  // 点击拨打电话
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '12345678900', //此号码并非真实电话号码，仅用于测试
      success: function () {
        wx.showToast({
          title: '拨打电话成功！',
        })
        console.log("拨打电话成功！")
      },
      fail: function () {
        wx.showToast({
          title: '拨打电话失败！',
        })
        console.log("拨打电话失败！")
      }
    })
  }

})