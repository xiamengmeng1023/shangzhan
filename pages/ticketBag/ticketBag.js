// pages/ticketBag/ticketBag.js

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
    isSelect: 1,
    type: 1,
    page: 2,
    rows: 5,
    list: [],
    cardId: '',
    templist: [],
    templist_1: [],
    templist_2: []
  },

  onLoad: function () {
    this.getbussness()
    let [
      that,
      token,
      type,
      rows,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      this.data.type,
      this.data.rows,
      dataUrl + "/Api/StoreOffer/getMemberOffer"
    ]
    console.log('isSelect', that.data.isSelect)
    console.log('type', that.data.type)
    let params_1 = {
      // 假数据
      token: token,
      // token: 1,
      type: 1,
      page: 1,
      list_rows: rows,
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: params_1,
      url: url,
      success: res => {
        console.log("获取卡包", res)
        if (res.data.code == 0) {
          that.setData({
            list: res.data.data
          })
          // if (res.data.data.length <= 4) {
          //   that.setData({
          //     loadIshow: false
          //   })
          // }
        }
      },
      fail: res => {
        console.log("res", res)
      }
    })







  },
  onShow: function () {







  },

  // 微名片
  getbussness() {
    let [that, token, getMyCardUrl, isVip] = [
      this,
      wx.getStorageSync('uid'),
      dataUrl + '/Api/Cardlist/getMyCard',
    ]
    let data = {
      token: token,
      order_status: 0
    }
    // 微名片请求
    network.POST({
      params: data,
      url: getMyCardUrl,
      success: res => {
        if (res.data.code === 0) {
          let resData = res.data.data


          that.setData({
            cardId: resData[0].id,
          })

        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  getMemberOffer(e) {
    // console.log('index为', this.data.type);
    console.log("e", e);

    this.setData({
      isSelect: e.currentTarget.dataset.index,
      type: e.currentTarget.dataset.index
    })

    let [
      that,
      token,
      type,
      rows,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      this.data.type,
      this.data.rows,
      dataUrl + "/Api/StoreOffer/getMemberOffer"
    ]
    console.log('isSelect', that.data.isSelect)
    console.log('type', that.data.type)
    let params_1 = {
      // 假数据
      token: token,
      // token: 1,
      type: 1,
      page: 1,
      list_rows: rows,
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: params_1,
      url: url,
      success: res => {
        console.log("获取卡包", res)
        if (res.data.code == 0) {
          that.setData({
            list: res.data.data
          })
          // if (res.data.data.length <= 4) {
          //   that.setData({
          //     loadIshow: false
          //   })
          // }
        }
      },
      fail: res => {
        console.log("res", res)
      }
    })

  },
  getInvalid(e) {
    this.setData({
      isSelect: e.currentTarget.dataset.index,
      type: e.currentTarget.dataset.index
    })

    let [
      that,
      token,
      type,
      rows,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      this.data.type,
      this.data.rows,
      dataUrl + "/Api/StoreOffer/getMemberOffer"
    ]
    console.log('isSelect', that.data.isSelect)
    console.log('type', that.data.type)
    let params_2 = {
      // 假数据
      token: token,
      // token: 1,
      type: 2,
      page: 1,
      list_rows: rows,
      // app_id: 'wxde059b418de529cd'
    }

    network.POST({
      params: params_2,
      url: url,
      success: res => {
        // console.log('params', params);
        console.log("获取失效卡包111", res)
        if (res.data.code == 0) {
          that.setData({
            templist_1: res.data.data
          })
          console.log('templist_1', that.data.templist_1);
          // if (res.data.data.length <= 4) {
          //   that.setData({
          //     loadIshow: false
          //   })
          // }
        }
      },
      fail: res => {
        console.log("res", res)
      }
    })
    let params_3 = {
      // 假数据
      token: token,
      // token: 1,
      type: 3,
      page: 1,
      list_rows: rows,
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: params_3,
      url: url,
      success: res => {
        // console.log('params', params);
        console.log("获取失效卡包2222", res)
        if (res.data.code == 0) {
          that.setData({
            templist_2: res.data.data
          })

          let templist_1 = that.data.templist_1
          let templist_2 = that.data.templist_2
          for (var i = 0; i < templist_2.length; i++) {
            templist_1.push(templist_2[i])
          }
          console.log('templist', templist_1);

          that.setData({
            templist: templist_1
          })
          console.log('templist', that.data.templist);
          // if (res.data.data.length <= 4) {
          //   that.setData({
          //     loadIshow: false
          //   })
          // }
        }
      },
      fail: res => {
        console.log("res", res)
      }
    })

  },
  goToUse() {
    wx.navigateTo({
      url: `/pages/company_details/company_details?card_id=${this.data.cardId}`
    })
  }
})