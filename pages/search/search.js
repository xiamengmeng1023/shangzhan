// pages/search/search.js

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
    cardList: [],
    isShow: false,
    inputVal: '',
    page: 2,
    rows: 4,
    searchEd: []
  },
  focus() {
    let cardArr = wx.getStorageSync("cardListStorage") || []
    this.setData({
      isShow: false,
      searchEd: cardArr
    })
  },
  bindinput(e) {
    let eVul = e.detail.value
    this.setData({
      inputVal: e.detail.value
    })
  },

  sub(e) {
    let [
      that,
      token,
      eVal,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      this.data.inputVal,
      dataUrl + "/Api/Cardlist/getCardlist"
    ]
    if (e.detail.value == '') {
      return
    }
    that.setData({
      inputVal: e.detail.value
    })
    let params = {
      token: token,
      keywords: eVal
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        if (res.data.code === 0) {
          let [resData, cardList] = [res.data.data, that.data.cardList]
          console.log('搜索数据', resData);
          if (resData.length > 0) {
            that.storageSet(resData)
          }
          that.setData({
            cardList: resData,
            isShow: true
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '暂无相关名片',
            success(res) {
              if (res.confirm) {

              } else if (res.cancel) {

              }
            }
          })
        }
      }
    })
  },
  // 缓存操作
  storageSet(arr) {
    let cardArr = wx.getStorageSync("cardListStorage") || []
    for (let i = 0, len = arr.length; i < len; i++) {
      if (cardArr.length < 8) {
        if (cardArr.length > 0) {
          for (let j = 0, cardLen = cardArr.length; j < cardLen; j++) {
            if (arr[i].card_id == cardArr[j].card_id) {
              cardArr.splice(j)
              cardArr.unshift(arr[i])
            } else {
              cardArr.unshift(arr[i])
            }
          }
        } else {
          cardArr.unshift(arr[i])
        }
      } else {
        for (let j = 0, cardLen = cardArr.length; j < cardLen; j++) {
          if (arr[i].card_id == cardArr[j].card_id) {
            cardArr.splice(j)
            cardArr.unshift(arr[i])
          } else {
            cardArr.pop()
            cardArr.unshift(arr[i])
          }
        }
      }
    }
    wx.setStorageSync("cardListStorage", cardArr)
  },


  // 操作名片列表
  operation: function (e) {
    let [id, cardList] = [e.currentTarget.dataset.id, this.data.cardList]
    for (let i = 0, len = cardList.length; i < len; i++) {
      if (id == cardList[i].card_id) {
        cardList[i].listMore = !(cardList[i].listMore)
      } else {
        cardList[i].listMore = false
      }
    }
    this.setData({
      cardList: cardList
    })
  },
  onShow() {
    let cardListStorage = wx.getStorageSync("cardListStorage") || []
    this.setData({
      searchEd: cardListStorage
    })

  },
  onHide: function () {
    this.setData({
      page: 2
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    this.getCardAdd()
  },
  getCardAdd: function () {
    this.setData({
      loadShow: true
    })
    let [that, token, page, rows, cardListUrl] = [this, wx.getStorageSync('uid'), this.data.page, this.data.rows, dataUrl + "/Api/Cardlist/getCardlist"]
    let params = {
      token: token,
      page: page,
      list_rows: rows
    }
    network.POST({
      params: params,
      url: cardListUrl,
      success: res => {
        console.log("res", res)
        if (res.data.code === 0) {
          let [resData] = [res.data.data]
          if (resData.length > 0) {
            page++
            for (let i = 0, len = resData.length; i < len; i++) {
              if (!(resData[i].icon.substring(-1, 2) == "ht")) {
                resData[i].icon = picUrl + resData[i].icon
                resData[i].listMore = false
              }
            }
            that.setData({
              cardList: that.data.cardList.concat(resData),
              page: page,

            })
          }
        }
        that.setData({
          loadShow: false
        })
      },
      fail: res => {
        console.log(res)
        that.setData({
          loadShow: false
        })
      }
    })
  },
  onShareAppMessage: function () {
    let sceneId = wx.getStorageSync("uid")
    let shareData = {
      sceneId
    }
    return {
      title: app.globalData.shareText,
      path: '/pages/index/index?shareData=' + JSON.stringify(shareData),
      success: res => {
        console.log("resShare", shareData)
      }
    }
  }
})