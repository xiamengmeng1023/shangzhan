// pages/order/order.js



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
    navIndex: 0,
    orderList: [],
    activIndex: 0,
    cardId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyCardId()
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
    // Api / Member
    // 36.我的订单：order_list
    // 参数：token
    // 结果{
    //   "code": 0 / 1, 	//0-成功1-失败
    //     "data": "
    let [that, token, url] = [this, wx.getStorageSync("uid"), dataUrl + "/Api/Member/order_list"]
    // 先获取假数据
    let data = {
      token: token,
      // token: 1642,
      // app_id: 'wxde059b418de529cd',
      order_status: ""
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", data)
        console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          if (!resData.length == 0) {
            // console.log("none");
            that.setData({
              orderList: resData,
              hasOrder: true
            })
          }
        }
      },
      fail: res => {

      }
    })
  },

  // 获取我的名片id
  getMyCardId() {
    let [that, token, cardListUrl] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Cardlist/getMyCard',
    ]

    let data = {
      token: token
    }
    network.POST({
      params: data,
      url: cardListUrl,
      success: res => {
        if (res.data.code === 0) {
          let resData = res.data.data
          // console.log('获取我的名片id', resData[0].id);
          that.setData({
            cardId: resData[0].id
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  navTap: function (e) {
    let that = this;
    let [
      navIndex,
      token,
      url
    ] = [
      that.data.navIndex,
      wx.getStorageSync("uid"),
      dataUrl + "/Api/Member/order_list"
    ]
    let itemIndex = e.currentTarget.dataset.index;
    that.setData({
      activIndex: itemIndex
    })
    if (itemIndex != navIndex) {
      that.setData({
        navIndex: itemIndex
      })
    }
    let orderStatus;
    // order_status   订单状态：0-未付款1-已付款2-已发货-3-退款4-已退款5-已签收6-企业已激活7-赠送
    if (that.data.navIndex == 0) {
      orderStatus = ""
    }
    if (that.data.navIndex == 1) {
      orderStatus = 0
    }
    if (that.data.navIndex == 2) {
      orderStatus = 2
    }
    if (that.data.navIndex == 3) {
      orderStatus = 5
    }
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading',
      duration: 500,
      success() {}
    })
    // console.log("that.data.navIndex", that.data.navIndex)
    // console.log("that.data.orderStatus", orderStatus)
    // 获取假数据
    let data = {
      token: token,
      // token: 1642,
      order_status: orderStatus,
      // app_id: 'wxde059b418de529cd'
      // app_id: 'wx5550cef350778b61',

    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        // console.log("res", data)
        // console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          console.log('resData的长度', resData.length);
          if (Array.isArray(resData) && resData.length !== 0) {
            that.setData({
              orderList: resData,
              hasOrder: true
            })
          } else {
            that.setData({
              orderList: []
            })
          }

        }
      },
      fail: res => {

      }
    })


  },
  goToOrderDeil(e) {
    let sn = e.currentTarget.dataset.sn
    console.log("sn", sn);

    wx.navigateTo({
      url: "/pages/obligation/obligation?orderSn={{sn}}"
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