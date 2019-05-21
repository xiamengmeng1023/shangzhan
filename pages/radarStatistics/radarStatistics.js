// pages/radarStatistics/radarStatistics.js



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
    iconUrl: iconUrl,
    profit: {
      profit: 0,
      num: 0,
      hits: 0
    }
  },

  // 财富请求
  getProfit() {
    let that = this
    let profitUrl = dataUrl + '/Api/Home/getProfit'
    let token = wx.getStorageSync('uid')
    let data = {
      token: token
    }
    network.POST({
      params: data,
      url: profitUrl,
      success: res => {
        // console.log('利润resData', res);
        if (res.data.code === 0) {
          let [resData, profit] = [res.data.data, that.data.profit]
          profit.profit = resData.profit
          profit.num = resData.num
          profit.hits = resData.hits
          that.setData({
            profit: profit
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sceneId;
    let cardId;
    if ('shareData' in options) {
      sceneId = JSON.parse(options.shareData).sceneId;
      cardId = JSON.parse(options.shareData).cardId;
    } else {
      cardId = options.cardId || 0
      sceneId = ""
    }
    wx.setStorageSync("sceneId", sceneId)
    this.setData({
      cardId: cardId
    })
    let [token, isVip] = [wx.getStorageSync('uid'), wx.getStorageSync('isVip')]
    // , phone   , wx.getStorageSync('phone') || phone == "" || phone == null
    if (token == "" || token == null || isVip == "" || isVip == null) {
      wx.redirectTo({
        url: '/pages/logonwx/logonwx',
      })
    }
  },
  // 分享
  goToshare() {
    this.onShareAppMessage()
  },
  onShareAppMessage() {
    let [sceneId, cardId] = [wx.getStorageSync("uid"), this.data.cardId]
    let shareData = {
      sceneId,
      cardId
    }
    return {
      title: app.globalData.shareText,
      path: '/pages/personalShops/personalShops?shareData=' + JSON.stringify(shareData),
      success: res => {
        console.log("resShare", shareData)
      }
    }
  },

  goToSelectionDate() {
    wx.navigateTo({
      url: '../../pages/selectionDate/selectionDate'
    })
  }
})