// pages/recruitment_details/recruitment_details.js
const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const WxParse = require('../../wxParse/wxParse.js');
const iconUrl = app.globalData.iconUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    tempUrl: '',
    newsId: '',
    pageData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      newsId: options.id,
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
    console.log('options', that.data.tempUrl);
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
    let that = this
    let getNewsDetailsUrl = dataUrl + this.data.tempUrl
    let getZhaopinUrl = dataUrl + '/Api/Home/getzhaopinDetail'
    // console.log('getNewsDetailsUrl', getNewsDetailsUrl);

    let token = wx.getStorageSync('uid')
    let data = {
      token: token,
      id: that.data.newsId,
      // app_id: 'wxde059b418de529cd'
    }

    network.POST({
      params: data,
      url: getZhaopinUrl,
      success: res => {
        if (res.data.code === 0) {
          let pageData = res.data.data
          pageData.city = pageData.address.substring(0, pageData.address.indexOf("市"));
          that.setData({
            pageData: pageData
          })
          console.log("招聘详情", pageData.content)
          WxParse.wxParse('summary', 'html', pageData.content, that, 1)
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