// pages/HistoryOfWithdrawal/HistoryOfWithdrawal.js
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
  // listDatail: function (e) {
  //   console.log("e", e)
  //   let id = e.currentTarget.dataset.id
  //   wx.navigateTo({
  //     url: '/pages/myWalletDetails/myWalletDetails?id=' + id,
  //   })
  // },
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
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Member/cash_withdrawal_history"]
    let data = {
      // token: token,
      token: 1,
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
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
  goTodet(e) {
    let id = e.currentTarget.dataset.id
    console.log('id', id);
    wx.navigateTo({
      url: '/pages/DetailsOfWithdrawals/DetailsOfWithdrawals?id=' + id,
    })
  }
})