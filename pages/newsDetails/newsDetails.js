// pages/newsDetails/newsDetails.js
const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempUrl: '',
    newsId: '',
    dataUrl: dataUrl,
    picUrl: picUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      newsId: options.newsId,
    })
    switch (options.typeId) {
      case "0":
        console.log('新闻');
        that.setData({
          tempUrl: "/Api/Home/getNewsDetail",
        })
        break;
      case "1":
        console.log('产品');
        that.setData({
          tempUrl: "/Api/Cardlist/goods_detail",
        })
        break;
      case "2":
        console.log('招聘');
        that.setData({
          tempUrl: "/Api/Home/getzhaopinDetail",
        })
        break;
      case "3":
        console.log('文章');
        that.setData({
          tempUrl: "/Api/Home/getArticleDetail",
        })
        break;
      case "4":
        console.log('祝福语');
        that.setData({})
        break;
      default:
        break;
    }
    console.log('options', options.newsId);
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
    let getNewsDetailsUrl = dataUrl + this.data.tempUrl
    let that = this
    console.log('getNewsDetailsUrl', getNewsDetailsUrl);
    let token = wx.getStorageSync('uid')
    // let token = 1
    let data = {
      app_id: 'wxde059b418de529cd',
      id: that.data.newsId
    }

    network.POST({
      params: data,
      url: getNewsDetailsUrl,
      success: res => {
        if (res.data.code === 0) {
          let pageData = res.data.data
          that.setData({
            pageData: pageData
          })
          WxParse.wxParse('summary', 'html', pageData.content, that, 1)
          // console.log('pageData', that.data.pageData);
        }
      },
      fail: res => {
        console.log("错误", res)
      }
    })


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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})